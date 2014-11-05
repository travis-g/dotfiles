-- User-edited settings for Luakit

----------------------------------
-- Optional user script loading --
----------------------------------

-- Load luakit-plugins files. AdBlock, tabmenu, uaswitch, yanksel, and
-- tabmenu plugins are all loaded here.
-- See https://github.com/luakit-crowd/luakit-plugins
require "plugins"
plugins.policy = "automatic"

-- Set homepage, moved to ./globals.lua
--globals.homepage            = "file:///home/t/newtab.html"

-- Set search engines, moved to ./globals.lua
-- List of search engines. Each item must contain a single %s which is
-- replaced by URI encoded search terms. All other occurances of the percent
-- character (%) may need to be escaped by placing another % before or after
-- it to avoid collisions with lua's string.format characters.
-- See: http://www.lua.org/manual/5.1/manual.html#pdf-string.format
--globals.search_engines = {
--    -- ddg = "https://duckduckgo.com/?q=%s",
--    gh  = "https://github.com/search?q=%s",
--    ggl = "https://google.com/search?q=%s",
--    aw  = "https://wiki.archlinux.org/index.php/Special:Search?fulltext=Search&search=%s",
--}
-- Set google as fallback search engine
--globals.search_engines.default = search_engines.ggl

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

-- vim: et:sw=4:ts=4:sts=4
