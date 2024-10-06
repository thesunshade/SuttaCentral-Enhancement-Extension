import "./style.css";
import { settingsConfig } from "./settingsConfig";

// Generate the settings form dynamically
function generateSettingsForm(config: any) {
  const form = document.getElementById("settingsForm") as HTMLFormElement;
  form.innerHTML = ""; // Clear existing content

  Object.keys(config).forEach(key => {
    const setting = config[key];
    const wrapper = document.createElement("div");

    // Label
    const label = document.createElement("label");
    label.innerHTML = setting.label;

    // Input element
    let input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    if (setting.type === "select") {
      input = document.createElement("select") as HTMLSelectElement;
      setting.choices.forEach((choice: string) => {
        const option = document.createElement("option");
        option.value = choice;
        option.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);
        input.appendChild(option);
      });
      input.id = key;
      wrapper.appendChild(label); // Append label first for select elements
      wrapper.appendChild(input); // Then append input
    } else if (setting.type === "checkbox") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.id = key;
      wrapper.appendChild(input); // Append input first for checkbox
      wrapper.appendChild(label); // Then append label
    } else if (setting.type === "textarea") {
      input = document.createElement("textarea") as HTMLTextAreaElement;
      input.id = key;
      wrapper.appendChild(label); // Append label first
      wrapper.appendChild(input); // Then append input
    } else if (setting.type === "radio") {
      setting.choices.forEach((choice: string) => {
        const radioWrapper = document.createElement("div");
        input = document.createElement("input");
        input.type = "radio";
        input.name = key; // All radios in the same group share the same name
        input.value = choice;
        input.id = `${key}_${choice}`;

        const radioLabel = document.createElement("label");
        radioLabel.htmlFor = `${key}_${choice}`;
        radioLabel.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);

        radioWrapper.appendChild(input);
        radioWrapper.appendChild(radioLabel);
        wrapper.appendChild(radioWrapper);
      });
    } else {
      input = document.createElement("input");
      input.type = "text"; // Default to text input for other types
      input.id = key;
      wrapper.appendChild(label); // Append label first
      wrapper.appendChild(input); // Then append input
    }

    // Append the wrapper to the form
    form.appendChild(wrapper);
  });
}

// Load all settings from chrome.storage.sync
async function loadSettings(config: any): Promise<any> {
  return new Promise(resolve => {
    const defaultValues: any = {};
    Object.keys(config).forEach(key => {
      defaultValues[key] = config[key].default;
    });

    chrome.storage.sync.get(defaultValues, items => {
      console.log("Loaded settings:", items); // Log loaded settings for debugging
      resolve(items);
    });
  });
}

// Apply loaded settings to the UI
function applySettingsToUI(settings: any) {
  Object.keys(settings).forEach(key => {
    const element = document.getElementById(key) as HTMLInputElement | HTMLSelectElement;

    if (!element) return; // Skip if element is not found

    if (element.type === "checkbox") {
      // Convert string to boolean for checkbox
      element.checked = settings[key] === "true"; // Ensure it’s treated as a boolean
    } else {
      element.value = settings[key];
    }
  });
}

// Save settings to chrome.storage.sync
function saveSettings(key: string, value: any) {
  const setting = { [key]: value };
  chrome.storage.sync.set(setting, () => {
    console.log(`Setting ${key} saved:`, value); // Log saved settings for debugging
  });
}

// Initialize the form and load the settings
async function initSettingsForm() {
  generateSettingsForm(settingsConfig);

  const settings = await loadSettings(settingsConfig);
  applySettingsToUI(settings);

  // Save changes on form input
  const form = document.getElementById("settingsForm") as HTMLFormElement;
  form.addEventListener("change", event => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (target) {
      let value: any;
      if (target.type === "checkbox") {
        value = target.checked ? "true" : "false"; // Convert boolean to string
      } else {
        value = target.value;
      }
      saveSettings(target.id, value);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSettingsForm();

  document.getElementById("refreshButton")?.addEventListener("click", () => {
    // Send a message to the background script to refresh the active tab
    chrome.runtime.sendMessage({ action: "refreshActiveTab" });
  });
});

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <h3>On Sutta Central.net</h3>
    
    <li>There is a mockup of a new navigation menu.</li>
    <li>Test of vertical view settings panel</li>

    <h3>On All sites</h3>
    <li>Hovering with the mouse over a link to suttas on SuttaCentral.net will <strong>pop up the blurb</strong> for that sutta.</li>
    <li><strong>Context menu item</strong> for selected text to search on SuttaCentral.net, search on the forum, go to suttaplex card, go to sutta text, and search PTS citation. </li>
</div>
`;
