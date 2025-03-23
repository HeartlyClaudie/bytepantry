-- Create Users Table
CREATE OR ALTER TABLE Users (
    userID INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,  -- Encrypted password
    notificationPreferences NVARCHAR(255) DEFAULT 'ALL', -- User preferences for alerts
    created_at DATETIME DEFAULT GETDATE()
);

-- Create Pantry Table (1-to-1 with Users)
CREATE OR ALTER TABLE Pantry (
    pantryID INT IDENTITY(1,1) PRIMARY KEY,
    userID INT NOT NULL UNIQUE, -- Ensuring 1-to-1 relationship
    name NVARCHAR(255) NOT NULL,
    location NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);

-- Create FoodItem Table (1-to-Many with Pantry)
CREATE OR ALTER TABLE FoodItem (
    itemID INT IDENTITY(1,1) PRIMARY KEY,
    pantryID INT NOT NULL,
    name NVARCHAR(255) NOT NULL,
    category NVARCHAR(100),
    barcode NVARCHAR(100) UNIQUE,
    addedDate DATE DEFAULT GETDATE(),
    expiryDate DATE,
    FOREIGN KEY (pantryID) REFERENCES Pantry(pantryID) ON DELETE CASCADE
);

-- Create DonationCenter Table (Stores Donation Centers)
CREATE OR ALTER TABLE DonationCenter (
    centerID INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    contactInfo NVARCHAR(255)
);

-- Create Donation Table (Tracks Food Donations, 1-to-Many with Users & Many-to-1 with DonationCenter)
CREATE OR ALTER TABLE Donation (
    donationID INT IDENTITY(1,1) PRIMARY KEY,
    userID INT NOT NULL,
    foodItems NVARCHAR(MAX) NOT NULL, -- List of donated items (for simple tracking)
    donationCenterID INT NOT NULL,
    donationDate DATE DEFAULT GETDATE(),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (donationCenterID) REFERENCES DonationCenter(centerID) ON DELETE CASCADE
);

-- Create Notification Table (1-to-Many with Users)
CREATE OR ALTER TABLE Notification (
    notificationID INT IDENTITY(1,1) PRIMARY KEY,
    userID INT NOT NULL,
    message NVARCHAR(255) NOT NULL,
    sentDate DATETIME DEFAULT GETDATE(),
    isRead BIT DEFAULT 0,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);
