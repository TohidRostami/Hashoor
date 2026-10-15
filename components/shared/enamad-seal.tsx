// eNamad (اینماد) trust seal.
//
// Deliberately a plain <img>, NOT next/image: the seal must be requested
// by the visitor's browser straight from trustseal.enamad.ir, with the
// referrer-policy below, so eNamad can verify the request comes from the
// registered domain. next/image would fetch it server-side through
// /_next/image and break that check.
//
// Also deliberately no rel="noreferrer": that would strip the referrer
// when the seal is clicked, which the eNamad verification page relies on.
const ENAMAD_ID = "8049838";
const ENAMAD_CODE = "gLppNxJ0t4QEfzQgxTiyTJUxHy3lVLGQ";

export function EnamadSeal() {
  return (
    <a
      referrerPolicy="origin"
      target="_blank"
      href="https://trustseal.enamad.ir/?id=8049838&Code=gLppNxJ0t4QEfzQgxTiyTJUxHy3lVLGQ"
    >
      <img
        referrerPolicy="origin"
        src="https://trustseal.enamad.ir/logo.aspx?id=8049838&Code=gLppNxJ0t4QEfzQgxTiyTJUxHy3lVLGQ"
        alt=""
        style={{ cursor: "pointer" }}
        {...{ code: ENAMAD_CODE }}
      />
    </a>
  );
}

// <a
//   referrerPolicy="origin"
//   target="_blank"
//   rel="noopener"
//   href={`https://trustseal.enamad.ir/?id=${ENAMAD_ID}&Code=${ENAMAD_CODE}`}
// >
//   {/* eslint-disable-next-line @next/next/no-img-element */}
//   <img
//     referrerPolicy="origin"
//     src={`https://trustseal.enamad.ir/logo.aspx?id=${ENAMAD_ID}&Code=${ENAMAD_CODE}`}
//     alt="نماد اعتماد الکترونیکی"
//     style={{ cursor: "pointer" }}
//     // `code` isn't a standard <img> attribute, so TypeScript rejects it
//     // as a plain prop; spreading it keeps it in the rendered HTML,
//     // exactly as in the snippet eNamad issued.
//     {...{ code: ENAMAD_CODE }}
//   />
// </a>
