
module.exports = {
    JWT_ADMIN_PASSWORD:process.env.JWT_ADMIN_PASSWORD,
    CLOUDINARY_CONFIG: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "your_default_cloud_name",
      API_KEY: process.env.CLOUDINARY_API_KEY || "your_default_api_key",
      API_SECRET: process.env.CLOUDINARY_API_SECRET || "your_default_api_secret"
    }
  };
