let brown300 = "#A1887F"

/**
 * Disable or enable a button.
 * 
 * @param {Boolean} disable True to disable the button, false to enable it.
 */
 const disableButton = (disable, button) => {
    button.disabled = disable;
    button.style.color = disable ? brown300 : "white";
}