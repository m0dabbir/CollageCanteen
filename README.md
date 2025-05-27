# JMI Canteen Portal

## Project Description

The JMI Canteen Portal is a web application designed to provide students and faculty of Jamia Millia Islamia (JMI) with easy access to information and services related to various canteens on campus. This platform aims to streamline the process of discovering canteen locations, viewing their menus, and potentially placing orders in the future.

Currently, the portal allows users to:

* **Browse a list of available canteens:** View a directory of different canteens located within the university.
* **View canteen-specific menus:** Access the menu items offered by each individual canteen.
* **User Registration and Login:** Users can create accounts and log in to access potentially personalized features in the future.
* **Canteen-Specific Authentication:** The application implements basic authentication, allowing users to register and log in within the context of a specific canteen (though user accounts are currently managed centrally).

This project is built using Node.js, Express.js, and EJS for server-side rendering. It utilizes a local MySQL database to store user account information and canteen details.

## Features

* **Browse Canteens:** A user-friendly interface to view all the listed canteens.
* **View Menus:** Dedicated pages for each canteen displaying their current menu offerings.
* **User Authentication:** Registration and login functionality for users.
* **Canteen Association:** User accounts are currently associated with the canteen they register or log in through.
* **Basic Client-Side Validation:** Implements JavaScript for basic form validation on the client-side.
* **Server-Side Validation:** Robust validation on the server-side for registration and login.
* **Password Hashing:** Utilizes `bcrypt` to securely store user passwords in the database.
* **MySQL Database Integration:** Stores user and canteen data in a local MySQL database.
* **Session Management:** Uses `express-session` to manage user login sessions.

## Technologies Used

* **Node.js:** JavaScript runtime environment for server-side development.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
* **EJS (Embedded JavaScript Templating):** A simple templating language for generating HTML.
* **MySQL:** A popular open-source relational database management system.
* **`mysql` (Node.js driver):** A Node.js driver for connecting to MySQL databases.
* **`express-session`:** Middleware for creating and managing user sessions in Express.js.
* **`bcrypt`:** A library for hashing and comparing passwords securely.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd JMI-Canteen-Portal
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the MySQL database:**
    * Ensure you have MySQL installed and running on your local machine.
    * Create a database named `StudentsFET`.
    * Create the `canteens` table by executing the following SQL:
        ```sql
        CREATE TABLE canteens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            description TEXT
        );

        INSERT INTO canteens (slug, name) VALUES ('fet', 'FET Canteen');
        INSERT INTO canteens (slug, name) VALUES ('central', 'Central Canteen');
        INSERT INTO canteens (slug, name) VALUES ('castro', 'Castro Canteen');
        INSERT INTO canteens (slug, name) VALUES ('law', 'Law Canteen');
        INSERT INTO canteens (slug, name) VALUES ('architecture', 'Architecture Canteen');
        ```
    * Create the `users` table by executing the following SQL:
        ```sql
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            canteen_id INT,
            FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE SET NULL
        );
        ```
    * Update the database connection details in your `server.js` file:
        ```javascript
        let db = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "your_mysql_password", // Replace with your MySQL password
          database: "StudentsFET",
        });
        ```
        **Replace `"your_mysql_password"` with your actual MySQL password.**

4.  **Run the application:**
    ```bash
    npm start
    ```

5.  **Open your browser and navigate to `http://localhost:3555`**.

## Future Enhancements

* **Displaying Menu Items:** Implement the display of menu items for each canteen, potentially fetched from a new `menu_items` table in the database.
* **User Roles and Permissions:** Implement more granular roles (e.g., canteen administrators) with specific permissions.
* **Order Placement:** Allow users to place orders online.
* **Shopping Cart Functionality:** Implement a shopping cart to manage items before placing an order.
* **Payment Gateway Integration:** Integrate with payment gateways for online transactions.
* **Search and Filtering:** Allow users to search for specific food items or filter canteens based on criteria.
* **User Profiles:** Allow users to manage their profile information and order history.
* **Admin Dashboard:** Create an administrative interface for managing canteens, menus, and users.
* **Improved UI/UX:** Enhance the user interface and user experience of the application.

## Developers

[Your Name(s)]

## License

[Your License (e.g., MIT License)]
