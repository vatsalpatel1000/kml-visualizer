KML Visualizer

This project is a simple React application that visualizes KML files on an interactive map using Leaflet.js. It allows users to upload KML files and view them on the map with summary and detailed statistics.

📌 Features

Upload .kml files to visualize Points, LineStrings, and Polygons.

Displays total length of LineStrings in meters.

Map rendering using Leaflet and OpenStreetMap tiles.

Summary and Detailed views of uploaded KML files.

🚀 Installation & Setup

Prerequisites

Node.js (v14 or higher)

npm or yarn

Clone the Repository

git clone https://github.com/vatsalpatel1000/kml-visualizer.git
cd kml-visualizer

Install Dependencies

npm install

Start the Application

npm start

The app will be running at http://localhost:3000.

📂 Uploading KML Files

You can upload your own KML files by clicking the Browse button.

An example KML file (test.kml) is provided in the project root directory.

After uploading, you can:

Click Summary to view counts of different elements.

Click Detailed to view the total length of LineStrings.

🌐 Deploying to GitHub Pages

Create a production build:

npm run build

Deploy the build/ folder to a static hosting service or use GitHub Pages.

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
