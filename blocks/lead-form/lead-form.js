import { proxyUrl } from '../../scripts/token.js';

async function loadSweetAlert() {
  if (window.Swal) return;

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.28/dist/sweetalert2.min.css';
  document.head.appendChild(css);

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.28/dist/sweetalert2.all.min.js';
  script.async = true;

  document.body.appendChild(script);

  return new Promise((resolve) => {
    script.onload = resolve;
  });
}


export default function decorate(block) {
  let apiDomain = "https://beta2-bizlogic-api.dishtv.in";

  const rows = block.querySelectorAll(':scope > div');

  const formRow = rows[0];
  if (formRow) formRow.classList.add('lead-form-input-container');
  
  const messageRow = rows[1];
  if (messageRow) {
    messageRow.classList.add('lead-form-message-container');
    const innerContent = messageRow.querySelector('div');
    if (innerContent) {
      innerContent.classList.add('lead-form-message-content');
      const paragraphs = innerContent.querySelectorAll('p');
      if (paragraphs.length > 0) paragraphs[0].classList.add('lead-form-or-text');
      if (paragraphs.length > 1) paragraphs[1].classList.add('lead-form-call-text');
    }
  }

  const form = document.createElement('form');
  form.classList.add('lead-form-element');

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.id = 'txtName';
  nameInput.placeholder = 'Name';
  nameInput.required = true;
  nameInput.classList.add('lead-form-input', 'lead-form-input-name');

  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.name = 'phone';
  phoneInput.id = 'txtMobile';
  phoneInput.placeholder = 'Mob No';
  phoneInput.required = true;
  phoneInput.classList.add('lead-form-input', 'lead-form-input-phone');

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Book New DishTV';
  submitBtn.classList.add('lead-form-submit-btn');

  form.append(nameInput, phoneInput, submitBtn);

  if (formRow) {
    formRow.textContent = '';
    formRow.append(form);
  }

  /* Mobile Sticky Toggle Button Logic */
  const mobileToggleBtn = document.createElement('button');
  mobileToggleBtn.classList.add('lead-form-mobile-toggle');
  mobileToggleBtn.textContent = 'Book New DishTV';
  
  // Append it to the main block so it sits outside the form row
  block.append(mobileToggleBtn);

  // Toggle open/close state on mobile
  mobileToggleBtn.addEventListener('click', () => {
    block.classList.toggle('is-open');
    if (block.classList.contains('is-open')) {
      mobileToggleBtn.textContent = 'Close';
    } else {
      mobileToggleBtn.textContent = 'Book New DishTV';
    }
  });

  /* API submission */

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await loadSweetAlert();
    const mobileNo = phoneInput.value;
    const name = nameInput.value;
    checkTicketForPD(mobileNo, name);
  });

  // Validate ticket and proceed to submit
  async function checkTicketForPD(mobileNo, name) {
    try {
      const apiUrl = proxyUrl(apiDomain + "/api/PrePaidHomeDelivery/CheckTicketForPD");
      const token = typeof readCookie === 'function' ? readCookie("token") : "";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MobileNo: mobileNo,
          Flag: "2",
        }),
      });
      const data = await response.json();
      if (data != null && data.data && data.data.resultCode == 0 && data.data.result.isValid == 0) {
        Swal.fire("", data.data.result.errDesc, "error");
      } else {
        getCallbackResponse(mobileNo, name);
      }
    } catch (err) {
      console.error("Error in checkTicketForPD:", err);
    }
  }

  // Submit user details for callback
  async function getCallbackResponse(mobileNo, name) {
    const loaderEl = document.querySelector(".loader-box-wrapper");
    const footerEl = document.querySelector(".landingpagebooknowfooter");
    const landingBtmEl = document.getElementById("landingbtmspace");

    function showLoader() {
      if (loaderEl) loaderEl.style.display = "";
    }
    function hideLoader() {
      if (loaderEl) loaderEl.style.display = "none";
    }
    function hideFooter() {
      if (footerEl) footerEl.style.display = "none";
    }
    function hideLandingBtm() {
      if (landingBtmEl) landingBtmEl.style.display = "none";
    }

    try {
      const url = new URL(window.location.href);
      const baseUrl = `${url.protocol}//${url.hostname}${url.pathname}`;
      const body = {
        URL: baseUrl,
        Name: name,
        AdUnit: "",
        SiteId: typeof utmSource !== 'undefined' ? utmSource : "",
        Source: typeof Source !== 'undefined' ? Source : "",
        UserId: "",
        Address: "",
        AdGroup: "",
        EmailID: "noemail@noemail.com",
        KeyWord: typeof utmKeyword !== 'undefined' ? utmKeyword : "",
        Message: "",
        Pincode: "",
        Section: "",
        Latitude: "",
        MobileNo: mobileNo,
        Longitude: "",
        SourceName: typeof SourceName !== 'undefined' ? SourceName : "",
        AlternateNo: "",
        IsHDconnection: "",
        ProspectiveSource: typeof ProspectiveSource !== 'undefined' ? ProspectiveSource : "",
        CurrentDTHConnection: "",
        Medium: typeof utmMedium !== 'undefined' ? utmMedium : "",
        Campaign: typeof utmCampaign !== 'undefined' ? utmCampaign : "",
        Device: typeof utmDevice !== 'undefined' ? utmDevice : "",
      };

      if (name.trim().length === 0) {
        Swal.fire("", "Please Enter Your Name", "error");
        return;
      }
      if (!/^[6-9]\d{9}$/.test(mobileNo)) {
        Swal.fire("", "Please Enter Valid Mobile No.", "error");
        return;
      }

      showLoader();
      const token = typeof readCookie === 'function' ? readCookie("token") : "";
      try {
        const response = await fetch(proxyUrl(apiDomain + "/API/Campaing/SubmitUserDetail"), {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        hideLoader();
        if (data != null && data.data && data.data.resultCode == 0) {
          hideFooter();
          Swal.fire(
            "",
            "Thank you for submitting your details. Our representative will get back to you shortly.",
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              hideLandingBtm();
              location.reload();
            }
          });
          nameInput.value = "";
          phoneInput.value = "";
          const txtNameEl = document.getElementById("txtName");
          const txtMobileEl = document.getElementById("txtMobile");
          if (txtNameEl) txtNameEl.value = "";
          if (txtMobileEl) txtMobileEl.value = "";
        } else {
          Swal.fire("", "Something went wrong", "warning").then(() => window.location.reload());
        }
      } catch (error) {
        hideLoader();
        console.error("AJAX error in getcallbackresponse:", error);
        Swal.fire("", "Something went wrong", "warning").then(() => window.location.reload());
      }
    } catch (err) {
      console.error("Error in getcallbackresponse:", err);
    }
  }

}