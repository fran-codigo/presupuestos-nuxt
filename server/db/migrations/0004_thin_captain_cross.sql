CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`budgetId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`amount` decimal NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_budgetId_budgets_id_fk` FOREIGN KEY (`budgetId`) REFERENCES `budgets`(`id`) ON DELETE cascade ON UPDATE no action;