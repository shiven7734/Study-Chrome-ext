const display = () => {
  const localStorageData = JSON.parse(localStorage.getItem("data"));
  if (!Array.isArray(localStorageData) || localStorageData.length === 0) {
    return;
  }
  localStorageData.forEach((tabGroup, index) => {
    buildCard(tabGroup, index);
  });
};
