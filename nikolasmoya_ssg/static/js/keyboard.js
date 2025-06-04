const keys = {
  // "normal" keys are just keys typed on the page
  // for exemple " " is when space is typed
  normal: {
    "arrowleft": (event, element) => {
      focus_on_files();
    },
    "arrowright": (event, element) => {
      focus_on_viewer();
    },
    "arrowup": (event, element) => {
      scroll_or_move_up(event, element);
    },
    "arrowdown": (event, element) => {
      scroll_or_move_down(event, element);
    },
  },

  // this is for keys when shift is pressed
  shortcut: {},
};

const commands = {
  // the key is used to specify the name of the command
  test: (command) => {
    alert("you entered 'test' command");

    // and then the return value with type and message
    return {
      type: "success", // "success" = green text, "error" = red text
      message: "command executed", // the text to show in the command line
    };
  },
};

function compare_urls(url1, url2) {
  normalized_url1 = url1.toLocaleLowerCase().replace(/\/$/, "");
  normalized_url2 = url2.toLocaleLowerCase().replace(/\/$/, "");
  return normalized_url1 === normalized_url2;
}


function get_current_link(links) {
  console.log(window.location.href);
  let readme = null;
  console.log(links);
  for (let link of links) {
    console.log(link.href.toLocaleLowerCase(), window.location.href.toLocaleLowerCase());
    if (link.href.includes("/readme/")) {
      readme = link;
    }
    if (compare_urls(link.href, window.location.href)) {
      return link;
    }
  }
  return readme;
}


function custom_init() {
  const files = document.getElementById("files");
  const links = files.getElementsByTagName("a");
  const current_link = get_current_link(links);
  if (current_link) {
    current_link.classList.add("selected");
  }
}

function focus_on_viewer() {
  document.getElementById("viewer").focus();
  Cookies.set("focused", "viewer");
}

function focus_on_files() {
  document.getElementById("files").focus();
  Cookies.set("focused", "files");
}

function scroll_or_move_up(event, element) {
  const is_page = element.classList.contains("page");
  const is_viewer = element.id == "viewer";
  const is_prompt = element.id == "setter";

  if (is_viewer && is_page) {
    element.scrollBy(0, -30);
  } else if (!is_prompt) {
    next_file(1, element);
  }
}

function scroll_or_move_down(event, element) {
  const is_page = element.classList.contains("page");
  const is_viewer = element.id == "viewer";
  const is_prompt = element.id == "setter";
  if (is_viewer && is_page) {
    element.scrollBy(0, 30);
  } else if (!is_prompt) {
    next_file(-1, element);
  }
}


function exec(event) {
  let element = document.activeElement;

  const key = event.key.toLocaleLowerCase();
  const is_page = element.classList.contains("page");
  const is_viewer = element.id == "viewer";
  const is_files = element.id == "files";
  const is_prompt = element.id == "setter";

  if (key != "r" && (is_viewer || is_files)) event.preventDefault();

  element = is_viewer ? document.getElementById("content") : element;
  console.log(event.key.toLocaleLowerCase());

  if (event.shiftKey) {
    if (
      typeof keys.shortcut != "undefined" &&
      typeof keys.shortcut[key] === "function"
    ) {
      keys.shortcut[key](event, element);
      return;
    }

    switch (key) {
      case "l":
        focus_on_viewer();
        break;

      case "h":
        focus_on_files();
        break;

      case "t":
        new_tab(element);
        break;

      case "q":
        del_tab();
        break;
    }
  } else {
    if (
      typeof keys.normal != "undefined" &&
      typeof keys.normal[key] === "function"
    ) {
      keys.normal[key](event, element);
      return;
    }

    switch (key) {
      case "escape":
        document.getElementById("setter").focus();
        document.getElementById("setter").value = "";
        break;

      case "enter":
        if (is_prompt) {
          command();
        } else {
          new_tab(element, true);
        }
        break;

      case "tab":
        if (is_viewer) {
          next_tab();
        }
        break;

      case "j":
        scroll_or_move_down(event, element);
        break;

      case "k":
        scroll_or_move_up(event, element);
        break;

      case "l":
        if (!is_prompt) {
          element.scrollBy(30, 0);
        }
        break;

      case "h":
        if (!is_prompt) {
          element.scrollBy(-30, 0);
        }
        break;
    }
  }
}

function next_file(incrementer, element) {
  const a = element.getElementsByClassName("selected")[0];
  const index = parseInt(a.attributes.tabindex.value);
  const next_element = element.querySelector(
    `[tabindex='${index + incrementer}']`,
  );

  if (next_element) {
    next_element.classList.add("selected");
    a.classList.remove("selected");
  }
}
