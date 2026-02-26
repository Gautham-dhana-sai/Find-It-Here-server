const BrandRoutes = require("./routes/brand-routes")
const CategoryRoutes = require("./routes/category-routes")
const FileRoutes = require("./routes/files-routes")
const ItemRoutes = require("./routes/item-routes")
const ProfileRoutes = require("./routes/profile-routes")

const routes = [
    ItemRoutes,
    ProfileRoutes,
    FileRoutes,
    CategoryRoutes,
    BrandRoutes
]

module.exports = routes