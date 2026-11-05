// Sample catalogue used by scripts/seed.js. Replace/extend via the admin panel.
const CATEGORIES = [
  { name: "ইসলামিক বই", description: "ঈমান, ইবাদত ও জীবনের ইসলামিক দিকনির্দেশনা" },
  { name: "কর্ম ও জীবিকা", description: "ক্যারিয়ার, আয় ও দক্ষতা বাড়ানোর বই" },
  { name: "সেলফ লার্নিং", description: "নিজে নিজে শেখা ও অভ্যাস গড়ার বই" },
  { name: "সিরিজ", description: "ধারাবাহিক বইয়ের সিরিজ" },
  { name: "বিজ্ঞান", description: "বিজ্ঞান ও প্রযুক্তি সহজ ভাষায়" },
  { name: "ব্যবসা", description: "ব্যবসা শুরু ও বাড়ানোর ব্যবহারিক বই" },
];

// hue drives the generated cover colour
const BOOKS = [
  { slug: "iman-er-alo", title: "ঈমানের আলো", category: "ইসলামিক বই", price: 199, originalPrice: 280, hue: 165, featured: true, desc: "ঈমানের মূল ভিত্তিগুলো সহজ ভাষায় বুঝিয়ে লেখা একটি গাইড, যা প্রতিদিনের জীবনে ঈমানকে মজবুত করতে সাহায্য করবে।" },
  { slug: "salat-er-prem", title: "সালাতের প্রেম", category: "ইসলামিক বই", price: 149, originalPrice: 199, hue: 190, desc: "সালাতে মনোযোগ ও বিনয় ফিরিয়ে আনার ব্যবহারিক কৌশল ও অনুপ্রেরণামূলক ঘটনা।" },
  { slug: "quran-er-golpo", title: "কুরআনের গল্প", category: "ইসলামিক বই", price: 229, hue: 140, featured: true, desc: "নবী-রাসূলদের শিক্ষণীয় কাহিনি, সহজ গল্পের ভঙ্গিতে।" },
  { slug: "halal-income", title: "হালাল উপার্জনের পথ", category: "কর্ম ও জীবিকা", price: 179, originalPrice: 240, hue: 35, desc: "হালাল পথে আয়, ব্যবসা ও বরকতের নীতিমালা নিয়ে ব্যবহারিক আলোচনা।" },
  { slug: "freelancing-shuru", title: "ফ্রিল্যান্সিং শুরুর গল্প", category: "কর্ম ও জীবিকা", price: 249, hue: 25, featured: true, desc: "শূন্য থেকে ফ্রিল্যান্সিং শুরু করার ধাপে ধাপে পরিকল্পনা, ক্লায়েন্ট পাওয়া ও মূল্য নির্ধারণ।" },
  { slug: "career-map", title: "ক্যারিয়ার ম্যাপ", category: "কর্ম ও জীবিকা", price: 199, hue: 45, desc: "নিজের দক্ষতা চিনে সঠিক ক্যারিয়ার পথ বেছে নেওয়ার নির্দেশিকা।" },
  { slug: "nijeke-gorun", title: "নিজেকে গড়ুন", category: "সেলফ লার্নিং", price: 159, originalPrice: 220, hue: 265, desc: "ছোট ছোট অভ্যাসে নিজেকে বদলানোর সহজ পদ্ধতি।" },
  { slug: "porar-kousol", title: "পড়ার কৌশল", category: "সেলফ লার্নিং", price: 139, hue: 285, desc: "কম সময়ে বেশি শেখা ও মনে রাখার প্রমাণিত কৌশল।" },
  { slug: "somoy-bebosthapona", title: "সময় ব্যবস্থাপনা", category: "সেলফ লার্নিং", price: 129, hue: 305, desc: "দিনের সময়কে কাজে লাগানোর পরিকল্পনা ও অগ্রাধিকার ঠিক করার গাইড।" },
  { slug: "series-1", title: "জীবনের পাঠ — পর্ব ১", category: "সিরিজ", price: 99, hue: 345, featured: true, desc: "জীবনের গুরুত্বপূর্ণ শিক্ষা নিয়ে ধারাবাহিক সিরিজের প্রথম পর্ব।" },
  { slug: "series-2", title: "জীবনের পাঠ — পর্ব ২", category: "সিরিজ", price: 99, hue: 5, desc: "সিরিজের দ্বিতীয় পর্ব: সম্পর্ক, ধৈর্য ও কৃতজ্ঞতা।" },
  { slug: "series-3", title: "জীবনের পাঠ — পর্ব ৩", category: "সিরিজ", price: 99, hue: 325, preOrder: true, desc: "সিরিজের তৃতীয় পর্ব — প্রি-অর্ডার চলছে।" },
  { slug: "biggan-ar-biswas", title: "বিজ্ঞান ও বিশ্বাস", category: "বিজ্ঞান", price: 189, originalPrice: 250, hue: 205, featured: true, desc: "বিজ্ঞানের আবিষ্কার ও বিশ্বাসের সম্পর্ক নিয়ে সহজ ও যুক্তিনির্ভর আলোচনা।" },
  { slug: "mohakash-er-rohosyo", title: "মহাকাশের রহস্য", category: "বিজ্ঞান", price: 169, hue: 225, desc: "গ্রহ-নক্ষত্র ও মহাবিশ্বের চমকপ্রদ তথ্য, ছোট-বড় সবার জন্য।" },
  { slug: "projukti-r-notun-juge", title: "প্রযুক্তির নতুন যুগ", category: "বিজ্ঞান", price: 179, hue: 245, desc: "এআই, ইন্টারনেট ও আগামী দিনের প্রযুক্তি কীভাবে জীবন বদলাচ্ছে।" },
  { slug: "chhoto-bebsha", title: "ছোট ব্যবসা, বড় স্বপ্ন", category: "ব্যবসা", price: 219, originalPrice: 290, hue: 80, featured: true, desc: "অল্প পুঁজিতে ব্যবসা শুরু, গ্রাহক ধরা ও ধাপে ধাপে বড় করার গাইড।" },
  { slug: "online-bebsha", title: "অনলাইন ব্যবসার কৌশল", category: "ব্যবসা", price: 199, hue: 100, desc: "ফেসবুক ও ই-কমার্সে বিক্রি বাড়ানোর কার্যকর কৌশল।" },
  { slug: "hisab-nikash", title: "হিসাব-নিকাশ সহজ", category: "ব্যবসা", price: 149, hue: 60, desc: "ব্যবসার আয়-ব্যয়, লাভ-ক্ষতি ও বাজেট বোঝার প্রাথমিক পাঠ।" },
];

const PLANS = [
  { name: "সিরিজ মাসিক", description: "‘সিরিজ’ ক্যাটেগরির সব বই ৩০ দিন পড়ুন।", price: 99, durationDays: 30, scope: "categories", categories: ["সিরিজ"], order: 0 },
  { name: "সব বই — মাসিক", description: "সব বই ৩০ দিন পড়ুন।", price: 199, durationDays: 30, scope: "all", categories: [], order: 1 },
  { name: "সব বই — বার্ষিক", description: "সব বই ৩৬৫ দিন পড়ুন — সবচেয়ে সাশ্রয়ী।", price: 1499, durationDays: 365, scope: "all", categories: [], order: 2 },
];

const AUTHOR = {
  name: "নমুনা লেখক",
  tagline: "লেখক ও বক্তা",
  bio: "এটি একটি নমুনা পরিচিতি। অ্যাডমিন প্যানেলের ‘Author Profile’ থেকে আসল নাম, ছবি ও জীবনী বসিয়ে নিন।",
};

module.exports = { CATEGORIES, BOOKS, PLANS, AUTHOR };
