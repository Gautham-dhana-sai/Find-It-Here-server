const FileRoutes = require("./routes/files-routes")
const ItemRoutes = require("./routes/item-routes")
const ProfileRoutes = require("./routes/profile-routes")

const routes = [
    ItemRoutes,
    ProfileRoutes,
    FileRoutes
]

module.exports = routes