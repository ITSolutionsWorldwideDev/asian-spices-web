const VIES_URL =
  "https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number";

const VIES_COUNTRIES = new Set([
  "AT",
  "BE",
  "BG",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "EL",
  "ES",
  "FI",
  "FR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
  "XI",
]);

export type VatCheckErrorCode =
  | "INVALID_FORMAT"
  | "INVALID_VAT"
  | "COUNTRY_MISMATCH"
  | "SERVICE_UNAVAILABLE";

export type VatCheckResult =
  | {
      ok: true;
      valid: true;
      skipped: false;
      formatted: string;
      countryCode: string;
      vatNumber: string;
      name?: string;
      address?: string;
    }
  | {
      ok: true;
      valid: true;
      skipped: true;
      formatted: string;
      countryCode: string;
      vatNumber: string;
    }
  | {
      ok: false;
      error: string;
      code: VatCheckErrorCode;
    };

type ViesResponse = {
  valid?: boolean;
  countryCode?: string;
  vatNumber?: string;
  name?: string;
  address?: string;
  actionSucceed?: boolean;
  errorWrappers?: Array<{ error?: string; message?: string }>;
};

export function normalizeVatNumber(raw: string) {
  return String(raw || "")
    .replace(/[\s.\-]/g, "")
    .toUpperCase();
}

export function toViesCountryCode(iso2: string) {
  const code = String(iso2 || "").trim().toUpperCase();
  if (code === "GR") return "EL";
  return code;
}

export function isViesCountry(code: string) {
  return VIES_COUNTRIES.has(toViesCountryCode(code));
}

export function parseVatNumber(raw: string) {
  const formatted = normalizeVatNumber(raw);

  if (!/^[A-Z]{2}[A-Z0-9]{2,12}$/.test(formatted)) {
    return null;
  }

  return {
    formatted,
    countryCode: formatted.slice(0, 2),
    vatNumber: formatted.slice(2),
  };
}

function cleanViesText(value?: string) {
  const text = String(value || "").trim();
  if (!text || /^[-*]+$/.test(text)) return undefined;
  return text;
}

function viesErrorMessage(payload: ViesResponse) {
  const code = payload.errorWrappers?.[0]?.error || "";

  if (
    code === "INVALID_INPUT" ||
    code === "INVALID_REQUESTER_INFO"
  ) {
    return {
      code: "INVALID_FORMAT" as const,
      error: "This VAT number format is not valid for the selected country.",
    };
  }

  return {
    code: "SERVICE_UNAVAILABLE" as const,
    error:
      "The EU VAT service is temporarily unavailable. Please try again in a moment.",
  };
}

export async function checkEuVatNumber({
  vat_number,
  country,
}: {
  vat_number: string;
  country?: string;
}): Promise<VatCheckResult> {
  const parsed = parseVatNumber(vat_number);

  if (!parsed) {
    return {
      ok: false,
      code: "INVALID_FORMAT",
      error: "Enter a VAT number like NL123456789B01.",
    };
  }

  const formCountry = country ? toViesCountryCode(country) : "";
  const vatCountry = toViesCountryCode(parsed.countryCode);

  if (
    formCountry &&
    isViesCountry(formCountry) &&
    vatCountry !== formCountry
  ) {
    return {
      ok: false,
      code: "COUNTRY_MISMATCH",
      error: `The VAT number must start with ${formCountry} to match the selected country.`,
    };
  }

  if (!isViesCountry(vatCountry)) {
    return {
      ok: true,
      valid: true,
      skipped: true,
      formatted: parsed.formatted,
      countryCode: vatCountry,
      vatNumber: parsed.vatNumber,
    };
  }

  try {
    const response = await fetch(VIES_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        countryCode: vatCountry,
        vatNumber: parsed.vatNumber,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const payload = (await response.json().catch(() => ({}))) as ViesResponse;

    if (!response.ok || payload.actionSucceed === false) {
      return {
        ok: false,
        ...viesErrorMessage(payload),
      };
    }

    if (!payload.valid) {
      return {
        ok: false,
        code: "INVALID_VAT",
        error: "This VAT number is not registered in the EU VIES system.",
      };
    }

    return {
      ok: true,
      valid: true,
      skipped: false,
      formatted: parsed.formatted,
      countryCode: payload.countryCode || vatCountry,
      vatNumber: payload.vatNumber || parsed.vatNumber,
      name: cleanViesText(payload.name),
      address: cleanViesText(payload.address),
    };
  } catch (error) {
    console.error("VIES VAT check failed:", error);
    return {
      ok: false,
      code: "SERVICE_UNAVAILABLE",
      error:
        "The EU VAT service is temporarily unavailable. Please try again in a moment.",
    };
  }
}
