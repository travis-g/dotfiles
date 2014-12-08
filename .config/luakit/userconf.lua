-- User-edited settings for Luakit

----------------------------------
-- Optional user script loading --
----------------------------------

-- Load luakit-plugins files. AdBlock, tabmenu, uaswitch, yanksel, and
-- tabmenu plugins are all loaded here.
-- See https://github.com/luakit-crowd/luakit-plugins
require "plugins"
plugins.policy = "automatic"

--!! Set homepage, moved to ./globals.lua

--!! Set search engines, moved to ./globals.lua

-- Per-domain webview properties
-- See http://webkitgtk.org/reference/webkitgtk/stable/WebKitWebSettings.html
globals.domain_props = { 
    ["draftin.com"] = {
        enable_scripts          = false,
        enable_plugins          = false,
        user_stylesheet_uri     = "",
    },
    --[[
    ["all"] = {
        enable_scripts          = false,
        enable_plugins          = false,
        enable_private_browsing = false,
        user_stylesheet_uri     = "",
    },
    ["youtube.com"] = {
        enable_scripts = true,
        enable_plugins = true,
    },
    ["bbs.archlinux.org"] = {
        user_stylesheet_uri     = "file://" .. luakit.data_dir .. "/styles/dark.css",
        enable_private_browsing = true,
    }, ]]
}

-- Use a custom charater set for hint labels (See follow.lua)
local s = follow.label_styles
-- "0123456789" Default
-- "asdfhjkl" Home row
-- "hjklasdfgyuiopqwertnmzxcvb" Smart
-- "asdfqwerzxcv" Suggested
follow.label_maker = s.sort(s.reverse(s.charset("asdfhjklgyuiopqwertnmzxcvb")))

-----------------------------
-- End user script loading --
-----------------------------

-- vim: set ts=4 sw=4 tw=0 et :
