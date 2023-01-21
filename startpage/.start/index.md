---
title: New Tab
# refresh: true
---

# 🏠

## Scroll

- [reddit](https://reddit.com)
- [imgur](https://imgur.com)
- [4chan](https://4chan.org)

---

## Listen

- [hypem](https://hypem.com)
- [plaza](https://plaza.one)
- [spotify](https://open.spotify.com)

---

## Watch

- [netflix](https://netflix.com)
- [crunchy](https://www.crunchyroll.com)
- [plex](https://app.plex.tv)

<script type="text/javascript">
  const req = new XMLHttpRequest();
  //const url = 'http://wttr.in/?format=%c%f'
  const url = "http://wttr.in/?format=%c";
  //const url = "http://wttr.in/?format=%C+%f";
  req.open("GET", url);
  req.send();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      h1 = document.querySelector("h1")
      h1.textContent = req.responseText
    } else {
      console.error(this)
    }
    h1.classList.add("show")
  };
</script>

<!-- vim: set nospell ft=markdown ts=2 sts=2 et: -->
