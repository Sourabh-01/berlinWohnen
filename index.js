import fetchData from "./fetchData.js";
import cheerio from "cheerio";
import TelegramBot from "node-telegram-bot-api";
import DBConnection from "./dbConnection.js";
import RoomsModel from "./models/Rooms.js";
import cron from "node-cron";
import * as dotenv from "dotenv";
dotenv.config();

function trimString(string) {
  return String(string).replace("undefined", "").trimEnd();
}
let users = [];
const token = process.env.API_TOKEN;
const Bot = new TelegramBot(token, { polling: true });
Bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users.push(chatId);
  Bot.sendMessage(
    msg.chat.id,
    "Halo,  " + msg.from.first_name + ". \n" + "Swagat karte hai apka!"
  );
});

const Main = async () => {
  const response = await fetchData();
  const availableRooms = await getLatestRooms();
  const $ = cheerio.load(response?.searchresults);
  const item = $(".wf ul li");
  let newRooms = [];
  item.each((idx, el) => {
    let apartment = {
      rooms: "",
      totalArea: "",
      rent: "",
      address: "",
      link: "",
    };
    apartment.rooms = $(el).children("h3").text().split(" ")[0];
    apartment.totalArea = $(el).children("h3").text().split(" ")[2] + "m\u00b2";
    apartment.rent = $(el).children("h3").text().split(" ")[5] + "€";
    apartment.address = String(
      trimString($(el).children("h3").text().split(" ")[9]) +
        " " +
        trimString($(el).children("h3").text().split(" ")[10]) +
        " " +
        trimString($(el).children("h3").text().split(" ")[11]) +
        " " +
        trimString($(el).children("h3").text().split(" ")[12])
    )
      .replace("undefined", "")
      .trimEnd();
    apartment.link =
      `https://inberlinwohnen.de` +
      $(el)
        .children("div")
        .children("div")
        .children("div")
        .children("a")
        .attr("href");
    newRooms.push(apartment);
  });
  await saveData(newRooms);
  const messages = compareRooms(newRooms, availableRooms);

  if (messages.length > 0) {
    for (let i = 0; i < messages.length; i++) {
      sendMessage(Bot, users, messages[i]);
    }
  }
};

const sendMessage = (Bot, users, message) => {
  for (let i = 0; i < users.length; i++) {
    Bot.sendMessage(
      users[i],
      `Found a new house: \n Number of rooms: ${message.rooms} \n Total Area: ${message.totalArea} \n Rent: ${message.rent} \n Address: ${message.address} \n Link: ${message.link}`
    );
  }
};

const saveData = async (requestData) => {
  const roomObject = new RoomsModel({ data: requestData });
  await roomObject.save();
};

const getLatestRooms = async () => {
  const list = await RoomsModel.find().sort({ addedOn: -1 }).limit(1);
  return list[0].data;
};

const compareRooms = (roomA, roomB) => {
  roomB = roomB.map((elem) => JSON.stringify(elem));

  let unique = roomA.filter(
    (elem) => roomB.indexOf(JSON.stringify(elem)) === -1
  );
  return unique;
};

// cron.schedule
cron.schedule("* * * * *", function () {
Main();
  console.log("Cron updated. Total users", users);
});

export default Main;
