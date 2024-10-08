import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../model/users";

// View balance function
const viewbalance = async (req: Request, res: Response) => {
  try {
    // Extract user ID from request object (assuming it's coming from authentication middleware)
    const userId = req.user?.id || req.params.id;
    if (!userId) {
      res.status(400).send("User ID not provided");
      return;
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).send("Invalid user ID");
      return;
    }

    // Validate the provided password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).send("Invalid password");
      return;
    }

    // Return user's wallet balance
    res.status(200).json({ balance: user.wallet });
  } catch (error) {
    console.error("Error in viewbalance:", error);
    res.status(500).send("Server error");
  }
};

export { viewbalance };
