--------------------------
-- Default luakit theme --
--------------------------

local theme = {}

-- Default settings
theme.font = "monospace normal 9"
theme.fg   = "#c5c8c6"
theme.bg   = "#1d1f21"

-- Genaral colours
theme.success_fg = "#198844"
theme.loaded_fg  = "#3971ED"
theme.error_fg = "#FFF"
theme.error_bg = "#CC342B"

-- Warning colours
theme.warning_fg = "#CC342B"
theme.warning_bg = "#FFF"

-- Notification colours
theme.notif_fg = "#444"
theme.notif_bg = "#FFF"

-- Menu colours
theme.menu_fg                   = "#000"
theme.menu_bg                   = "#fff"
theme.menu_selected_fg          = "#000"
theme.menu_selected_bg          = "#FBA922"
theme.menu_title_bg             = "#fff"
theme.menu_primary_title_fg     = "#CC342B"
theme.menu_secondary_title_fg   = "#666"

-- Proxy manager
theme.proxy_active_menu_fg      = "#000"
theme.proxy_active_menu_bg      = "#FFF"
theme.proxy_inactive_menu_fg    = "#888"
theme.proxy_inactive_menu_bg    = "#FFF"

-- Statusbar specific
theme.sbar_fg         = "#fff"
theme.sbar_bg         = "#1d1f21"

-- Downloadbar specific
theme.dbar_fg         = "#fff"
theme.dbar_bg         = "#1d1f21"
theme.dbar_error_fg   = "#CC342B"

-- Input bar specific
theme.ibar_fg           = "#fff"
theme.ibar_bg           = "#1d1f21"

-- Tab label
theme.tab_fg            = "#888"
theme.tab_bg            = "#1d1f21"
theme.tab_ntheme        = "#ddd"
theme.selected_fg       = "#fff"
theme.selected_bg       = "#000"
theme.selected_ntheme   = "#ddd"
theme.loading_fg        = "#3971ED"
theme.loading_bg        = "#1d1f21"

-- Trusted/untrusted ssl colours
theme.trust_fg          = "#198844"
theme.notrust_fg        = "#CC342B"

return theme
-- vim: et:sw=4:ts=8:sts=4:tw=80
