CREATE TABLE `connection_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`serverId` int NOT NULL,
	`connectedAt` timestamp NOT NULL DEFAULT (now()),
	`disconnectedAt` timestamp,
	`durationSeconds` int DEFAULT 0,
	`dataUpMB` int DEFAULT 0,
	`dataDownMB` int DEFAULT 0,
	CONSTRAINT `connection_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `device_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceName` varchar(128) NOT NULL,
	`deviceType` varchar(32) NOT NULL DEFAULT 'phone',
	`os` varchar(64),
	`ipAddress` varchar(64),
	`location` varchar(128),
	`sessionToken` varchar(255) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastSeenAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `device_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `device_sessions_sessionToken_unique` UNIQUE(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referredEmail` varchar(320) NOT NULL,
	`status` enum('pending','completed') NOT NULL DEFAULT 'pending',
	`rewardDays` int NOT NULL DEFAULT 7,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`killSwitchEnabled` boolean NOT NULL DEFAULT false,
	`autoConnect` boolean NOT NULL DEFAULT false,
	`selectedProtocol` varchar(32) NOT NULL DEFAULT 'WireGuard',
	`splitTunnelEnabled` boolean NOT NULL DEFAULT false,
	`threatProtEnabled` boolean NOT NULL DEFAULT true,
	`adBlockEnabled` boolean NOT NULL DEFAULT false,
	`bandwidthShareEnabled` boolean NOT NULL DEFAULT false,
	`bandwidthSharedGB` int NOT NULL DEFAULT 0,
	`creditsEarned` int NOT NULL DEFAULT 0,
	`selectedServerId` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_settings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `vpn_servers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`countryCode` varchar(8) NOT NULL,
	`countryName` varchar(64) NOT NULL,
	`city` varchar(64) NOT NULL,
	`flag` varchar(8) NOT NULL,
	`pingMs` int NOT NULL DEFAULT 50,
	`isPremium` boolean NOT NULL DEFAULT false,
	`isP2P` boolean NOT NULL DEFAULT false,
	`isStreaming` boolean NOT NULL DEFAULT false,
	`category` varchar(32) NOT NULL DEFAULT 'popular',
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `vpn_servers_id` PRIMARY KEY(`id`)
);
