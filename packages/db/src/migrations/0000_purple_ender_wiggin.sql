CREATE TABLE `national_firstnames` (
	`firstname` text NOT NULL,
	`year` integer NOT NULL,
	`count` integer NOT NULL,
	`sex` integer NOT NULL,
	PRIMARY KEY(`firstname`, `year`, `sex`)
);
--> statement-breakpoint
CREATE TABLE `regional_firstnames` (
	`firstname` text NOT NULL,
	`year` integer NOT NULL,
	`count` integer NOT NULL,
	`sex` integer NOT NULL,
	`region` text NOT NULL,
	PRIMARY KEY(`firstname`, `year`, `sex`, `region`)
);
--> statement-breakpoint
CREATE TABLE `similar_firstnames` (
	`firstname` text NOT NULL,
	`similar_firstname` text NOT NULL,
	`correlation` real NOT NULL,
	`source_sex` integer NOT NULL,
	`target_sex` integer NOT NULL,
	`rank` integer NOT NULL,
	PRIMARY KEY(`firstname`, `source_sex`, `target_sex`, `rank`)
);
