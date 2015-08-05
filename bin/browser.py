#!/usr/bin/env python2
# http://ubuntuforums.org/showthread.php?t=1487183
import sys
import gtk
import webkit
HOME_URL = 'http://tjg.io/newtab/'
class SimpleBrowser: # needs GTK, Python, Webkit-GTK
    def __init__(self):
        self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
        self.window.set_position(gtk.WIN_POS_CENTER_ALWAYS)
        self.window.connect('delete_event', self.close_application)
        self.window.set_default_size(350, 20)
        vbox = gtk.VBox(spacing=5)
        vbox.set_border_width(5)
        self.txt_url = gtk.Entry()
        self.txt_url.connect('activate', self._txt_url_activate)
        self.scrolled_window = gtk.ScrolledWindow()
        self.webview = webkit.WebView()
        self.scrolled_window.add(self.webview)
        vbox.pack_start(self.scrolled_window, fill=True, expand=True)
        self.window.add(vbox)
    def _txt_url_activate(self, entry):
        self._load(entry.get_text())
    def _load(self, url):
        self.webview.open(url)
    def open(self, url):
        self.txt_url.set_text(url)
        self.window.set_title('%s' % url)
        self._load(url)
    def show(self):
        self.window.show_all()
    def close_application(self, widget, event, data=None):
        gtk.main_quit()
if __name__ == '__main__':
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = HOME_URL
    gtk.gdk.threads_init()
    browser = SimpleBrowser()
    browser.open(url)
    browser.show()
    gtk.main()
# vim: et ts=4 sts=4 sw=4:
