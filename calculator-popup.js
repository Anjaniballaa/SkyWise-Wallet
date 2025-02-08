// JavaScript for calculator popup
document.addEventListener("DOMContentLoaded", () => {
    const popupDisplay = document.getElementById('popupDisplay');
    let popupInput = '';

    // Toggle the popup visibility
    window.togglePopup = function () {
        const popup = document.getElementById('calculatorPopup');
        popup.classList.toggle('hidden');
    };

    // Calculator functions for the popup
    window.appendPopupNumber = function (number) {
        popupInput += number;
        popupDisplay.value = popupInput;
    };

    window.appendPopupOperator = function (operator) {
        if (popupInput !== '' && !isNaN(popupInput.slice(-1))) {
            popupInput += operator;
            popupDisplay.value = popupInput;
        }
    };

    window.clearPopupDisplay = function () {
        popupInput = '';
        popupDisplay.value = '';
    };

    window.calculatePopup = function () {
        try {
            popupInput = eval(popupInput).toString();
            popupDisplay.value = popupInput;
        } catch {
            popupDisplay.value = 'Error';
            popupInput = '';
        }
    };
});
