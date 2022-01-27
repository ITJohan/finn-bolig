const searchForm = document.getElementById('search-form');
const apartmentTemplate = document.getElementById('new-apartment');
const newSection = document.getElementById('new-section');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = e.target[0].value;

  const data = await fetchApartmentData(url);

  console.log(data);

  data.forEach((apartment) => {
    const apartmentEl = apartmentTemplate.content.cloneNode(true);
    const p = apartmentEl.querySelector('p');
    p.textContent = apartment.address;

    const btn = apartmentEl.querySelector('.kart-btn');
    console.log(btn);
    btn.addEventListener('click', (e) => {
      const map = document.getElementById('map');
      const src = `https://maps.google.com/maps?q=${apartment.url.replace(
        ' ',
        '%20'
      )}&t=&z=11&ie=UTF8&iwloc=&output=embed`;
      console.log(src);
      map.src = src;
    });

    newSection.appendChild(apartmentEl);
  });
});

const fetchApartmentData = async (url) => {
  const response = await fetch(url);
  const data = await response.text();
  const html = document.createElement('html');
  html.innerHTML = data;

  const apartments = html.querySelectorAll(
    '#page-results > div.ads.ads--grid.ads--cards > article > div.ads__unit__content'
  );

  reportToTerminal(`found ${apartments.length} apartments...`);

  const apartmentData = [];

  apartments.forEach((apartment) => {
    const addressEl = apartment.querySelector(
      'div.ads__unit__content__details > div'
    );
    const apartmentUrl = apartment.querySelector(
      '.ads__unit__content__title > .ads__unit__link'
    );

    const address = addressEl.textContent;
    const url = apartmentUrl.href;

    apartmentData.push({ address, url });
  });

  return apartmentData;
};

const fetchAdress = async (url) => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'include',
    });
    const data = await response.text();
    const html = document.createElement('html');
    html.innerHTML = data;

    const address = html.querySelector(
      '#realestateClassifiedContainer > div:nth-child(2) > div > div.grid__unit.u-r-size2of3 > div > section:nth-child(2) > p'
    );

    console.log(address);
  } catch (e) {
    console.error(e.message);
  }
};

const reportToTerminal = (string) => {
  const p = document.createElement('p');
  p.innerText = string;

  const terminal = document.getElementById('terminal');
  terminal.appendChild(p);
};
