import mongoose from "mongoose";

const room = mongoose.Schema({
    data: {type: Array, default: []},
    addedOn: {type: Number, default: Date.now()},
})

const Rooms = mongoose.model("Rooms", room);

export default Rooms;