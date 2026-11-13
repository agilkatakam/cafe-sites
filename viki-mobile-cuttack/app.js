// Viki Mobile, Cuttack
(function () {
  var cb = document.getElementById('copybtn');
  if (cb) cb.addEventListener('click', function () {
    var t = cb.dataset.copy;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { cb.textContent = 'Copied'; }, function () { cb.textContent = 'Select the email'; });
    setTimeout(function () { cb.textContent = 'Copy'; }, 1800);
  });
})();
