require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const FormData = require('form-data');



const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const BACKEND_URL = process.env.BACKEND_URL;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const adminIds = [1573771417];

let tempImages = {}; // { userId: imageLink }
const activeUsers = new Set();

// /start komandasi
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const name = msg.from.first_name;

  activeUsers.add(userId);
  const usersCount = activeUsers.size;

  const miniAppUrl = "https://telegram-miniapp-lilac.vercel.app/"; // O'zingizning mini app URL'ingizni kiriting

  const firstName = msg.from.first_name || '';
  const lastName = msg.from.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();

  if (adminIds.includes(userId)) {
    // Admin uchun
    bot.sendMessage(chatId, `👋 Salom, Admin ${name}!
📊 Foydalanuvchilar soni: ${usersCount} ta
🧾 Buyruqlar:
/add — Mahsulot qo‘shish (rasm + info)
/list — Mahsulotlar ro‘yxatini ko‘rish va tahrirlash
/delete — Mahsulotni o‘chirish (ro‘yxat orqali)
`, {
      reply_markup: {
        keyboard: [
          [
            {
              text: "🛍 Mini Do‘kon",
              web_app: { url: miniAppUrl }
            }
          ]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    });
  } else {
    // Oddiy foydalanuvchi uchun
    bot.sendMessage(chatId, `👋 Assalomu alaykum, ${fullName}!\n\n 🛍 Vitamin va dori mahsulotlari do‘koniga xush kelibsiz!\n\n💡 Foydali mahsulotlar aynan siz uchun tayyor!`, {
      reply_markup: {
        keyboard: [
          [
            {
              text: "🛍 Mini Do‘kon",
              web_app: { url: "https://your-miniapp.vercel.app" } // <-- bu yerga haqiqiy mini app URL'ingizni yozing
            }
          ]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    });
  }
});

// /add komandasi
bot.onText(/\/add/, (msg) => {
  const userId = msg.from.id;
  if (!adminIds.includes(userId)) return;

  bot.sendMessage(msg.chat.id, `📷 Avval mahsulot rasmini yuboring, so‘ngra quyidagi formatda yuboring:
Nomi;Turi;Narxi;Tavsif;Yosh`);
});

// Admin rasm yuborganda
bot.on('photo', async (msg) => {
  const userId = msg.from.id;
  if (!adminIds.includes(userId)) return;

  const fileId = msg.photo[msg.photo.length - 1].file_id;
  const fileLink = await bot.getFileLink(fileId);
  tempImages[userId] = fileLink;

  bot.sendMessage(msg.chat.id, '📄 Rasm qabul qilindi. Endi quyidagi formatda yozing:\nNomi;Turi;Narxi;Tavsif;Yosh');
});

// Admin matn yuborganda — mahsulot qo‘shiladi
bot.on('message', async (msg) => {
  const userId = msg.from.id;
  if (!adminIds.includes(userId)) return;
  if (msg.photo) return;

  if (tempImages[userId]) {
    const parts = msg.text.split(";");
    if (parts.length < 5) {
      return bot.sendMessage(msg.chat.id, `❌ Format xato. Masalan:\nVitamin C;vitamin;25000;Immunitetni mustahkamlaydi;12+`);
    }

    const [name, type, price, description, age] = parts;

    try {
      const imageUrl = await uploadToImgbb(tempImages[userId]);
      await axios.post(`${BACKEND_URL}/api/products`, {
        name, type, price, image: imageUrl, description, age
      });
      bot.sendMessage(msg.chat.id, `✅ Mahsulot qo‘shildi: ${name}`);
    } catch (err) {
      bot.sendMessage(msg.chat.id, "❌ Xatolik: " + err.message);
    }

    delete tempImages[userId];
  }
});

// /list komandasi
bot.onText(/\/list/, async (msg) => {
  const userId = msg.from.id;
  if (!adminIds.includes(userId)) return;

  try {
    const res = await axios.get(`${BACKEND_URL}/api/products`);
    if (!res.data.length) return bot.sendMessage(msg.chat.id, "🚫 Mahsulotlar mavjud emas.");

    for (const product of res.data) {
      const caption = `📦 <b>${product.name}</b>
💰 ${product.price} so'm
🧾 ${product.description}
👶 ${product.age}+ yosh`;

      const options = {
        reply_markup: {
          inline_keyboard: [[
            { text: "✏️ Tahrirlash", callback_data: `edit_${product._id}` },
            { text: "🗑 O‘chirish", callback_data: `delete_${product._id}` }
          ]]
        },
        parse_mode: "HTML"
      };

      if (product.image && product.image.startsWith("http")) {
        await bot.sendPhoto(msg.chat.id, product.image, { caption, ...options });
      } else {
        await bot.sendMessage(msg.chat.id, caption, options);
      }
    }
  } catch (err) {
    bot.sendMessage(msg.chat.id, "❌ Mahsulotlarni olishda xatolik: " + err.message);
  }
});

// ImgBB yuklash funksiyasi
async function uploadToImgbb(imageUrl) {
  const buffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const base64Image = Buffer.from(buffer.data).toString('base64');

  const form = new FormData();
  form.append('image', base64Image);

  const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, form, {
    headers: form.getHeaders()
  });

  return res.data.data.display_url;
}

// Callback tugmalar
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const [action, id] = query.data.split("_");

  // ❗️O‘chirish tasdiqlash oynasi
  if (action === "delete") {
    return bot.sendMessage(chatId, "❗️ Rostdan ham ushbu mahsulotni o‘chirmoqchimisiz?", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Ha", callback_data: `confirmDelete_${id}` },
            { text: "❌ Yo‘q", callback_data: `cancelDelete` }
          ]
        ]
      }
    });
  }

  // ✅ Ha bosilsa — o‘chiramiz
  if (action === "confirmDelete") {
    try {
      await axios.delete(`${BACKEND_URL}/api/products/${id}`);
      bot.sendMessage(chatId, "🗑 Mahsulot muvaffaqiyatli o‘chirildi.");
    } catch (err) {
      bot.sendMessage(chatId, "❌ O‘chirishda xatolik: " + err.message);
    }
  }

  // ❌ Yo‘q bosilsa
  if (action === "cancelDelete") {
    bot.sendMessage(chatId, "❎ O‘chirish bekor qilindi.");
  }

  // ✏️ Tahrirlash bosilsa
  if (action === "edit") {
    bot.sendMessage(chatId, "✏️ Yangi maʼlumotni yuboring (Nomi;Narxi):");

    bot.once("message", async (msg2) => {
      const parts = msg2.text.split(";");
      if (parts.length < 2) {
        return bot.sendMessage(chatId, "❌ Format noto‘g‘ri. Masalan: Paracetamol;18000");
      }

      const [name, price] = parts;

      try {
        await axios.put(`${BACKEND_URL}/api/products/${id}`, { name, price });
        bot.sendMessage(chatId, "✅ Mahsulot yangilandi.");
      } catch (err) {
        bot.sendMessage(chatId, "❌ Yangilashda xatolik: " + err.message);
      }
    });
  }

  bot.answerCallbackQuery(query.id); // 👈 bu kerakli qism!
});
