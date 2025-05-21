import mongoose from 'mongoose';

const homeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String }
}, { timestamps: true });

const Home = mongoose.model('Home', homeSchema);

export default Home;
