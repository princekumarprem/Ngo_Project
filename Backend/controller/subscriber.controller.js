import Subscriber from "../model/subscriber.model.js";


export const createSubscriber = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "You are already subscribed" });
    }

    const subscriber = await Subscriber.create({ firstName, lastName, email });

    return res.status(201).json({
      message: "Subscribed successfully",
      subscriber,
    });
  } catch (err) {
    next(err);
  }
};


export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    next(err);
  }
};


export const deleteSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sub = await Subscriber.findByIdAndDelete(id);
    if (!sub) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    res.json({ message: "Subscriber removed" });
  } catch (err) {
    next(err);
  }
};
