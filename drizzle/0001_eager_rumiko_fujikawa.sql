ALTER TABLE `users` ADD `subscriptionTier` enum('free','pro','max') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `avatarColor` varchar(16) DEFAULT '#00C896';--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(255);