import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Use motion with Input, passing type="number" for number input functionality
export const MotionCard = motion(Card);
export const MotionCardContent = motion(CardContent);
export const MotionInput = motion(Input);
export const MotionNumberInput = motion((props) => <Input {...props} type="number" />);
export const MotionTextarea = motion(Textarea);
export const MotionButton = motion(Button);
