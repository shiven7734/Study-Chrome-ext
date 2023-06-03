const addEventListenerForPersistChange = () => {
  let checkboxes = document.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((checkbox) =>
    checkbox.addEventListener("change", sessionPersistanceSetting)
  );
};

const addEventListenerForSaveName = () => {
  let saveCardNameButtons = document.querySelectorAll("button.name-save-btn");
  saveCardNameButtons.forEach((button) =>
    button.addEventListener("click", saveCardName)
  );
};

const attachClickListener = () => {
  cardListDiv.addEventListener("click", function (event) {
    if (!event.target.classList.contains("actionBtn")) return;

    const clickedElement = event.target;
    if (clickedElement.classList.contains("restore")) restore(clickedElement);
    else deleteCard(clickedElement);
  });
};

const deleteCard = (deleteBtn) => {
  const indexOfClickedCard = parseInt(deleteBtn.id.substring(4), 10);

  let clickedCard = document.querySelector(
    "#card-section-" + indexOfClickedCard
  );
  clickedCard.remove();
  location.href = "popup.html";

  const savedData = JSON.parse(localStorage.getItem("data"));
  savedData.splice(indexOfClickedCard, 1);
  localStorage.setItem("data", JSON.stringify(savedData));
};

const restore = function (restoreBtn) {
  const savedData = JSON.parse(localStorage.getItem("data"));
  const indexOfClickedCard = parseInt(restoreBtn.id.substring(8), 10);

  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    let currentIndex = tabs[0].index;

    savedData[indexOfClickedCard].urls.forEach((url) => {
      chrome.tabs.create({ url: url });
    });

    if (currentIndex !== null) {
      chrome.tabs.highlight({ tabs: currentIndex });
    }

    if (!savedData[indexOfClickedCard].persist) {
      let clickedCard = document.querySelector(
        "#card-section-" + indexOfClickedCard
      );
      clickedCard.remove();

      savedData.splice(indexOfClickedCard, 1);
      localStorage.setItem("data", JSON.stringify(savedData));
    }
  });
};

const sessionPersistanceSetting = function (event) {
  const indexOfCard = event.target.id;
  const savedTabGroups = JSON.parse(localStorage.getItem("data"));

  let indexToInsertAt;
  if (!event.target.checked) {
    indexToInsertAt = savedTabGroups.findIndex((tabGroup) => !tabGroup.persist);
  }

  savedTabGroups[indexOfCard].persist = event.target.checked;

  if (event.target.checked) {
    if (indexOfCard > 0) {
      savedTabGroups.unshift(savedTabGroups.splice(indexOfCard, 1)[0]);
    }
  } else {
    if (savedTabGroups.length > 1) {
      if (indexToInsertAt == -1) {
        savedTabGroups.push(savedTabGroups.splice(indexOfCard, 1)[0]);
      } else {
        indexToInsertAt--;
        savedTabGroups.splice(
          indexToInsertAt,
          0,
          savedTabGroups.splice(indexOfCard, 1)[0]
        );
      }
    }
  }

  localStorage.setItem("data", JSON.stringify(savedTabGroups));
};

const saveCardName = (event) => {
  let idString = event.target.id;
  const indexOfCardClicked = parseInt(idString.substring(8), 10);

  let nameTextBox = document.querySelector("#name-" + indexOfCardClicked);
  const enteredName = nameTextBox.value;
  if (enteredName) {
    const savedTabGroups = JSON.parse(localStorage.getItem("data"));
    savedTabGroups[indexOfCardClicked].name = enteredName;
    localStorage.setItem("data", JSON.stringify(savedTabGroups));
  }
  location.href = "popup.html";
};
