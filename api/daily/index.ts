import { NowResponse } from "@now/node";
import { getConfirmedGraph } from "../../util/api";

export default async (_, response: NowResponse) => {
  const result = Object.entries(
    (await getConfirmedGraph()).reduce((acc, cur) => {
      const totalConfirmed =
        cur.confirmed +
        ((acc[cur.date] &&
          acc[cur.date].confirmed &&
          acc[cur.date].confirmed.total) ||
          0);
      const mainlandChina =
        (cur.countryRegion === "China" ? cur.confirmed : 0) +
        ((acc[cur.date] &&
          acc[cur.date].confirmed &&
          acc[cur.date].confirmed.china) ||
          0);

      const otherLocations =
        (cur.countryRegion !== "China" ? cur.confirmed : 0) +
        ((acc[cur.date] &&
          acc[cur.date].confirmed &&
          acc[cur.date].confirmed.outsideChina) ||
          0);
      const deltaConfirmed =
        cur.deltaConfirmed +
        ((acc[cur.date] &&
          acc[cur.date].deltaConfirmed &&
          acc[cur.date].deltaConfirmed.total) ||
          0);

      const totalRecovered =
        cur.recovered +
        ((acc[cur.date] &&
          acc[cur.date].recovered &&
          acc[cur.date].recovered.total) ||
          0);

      return {
        ...acc,
        [cur.date]: {
          totalConfirmed,
          mainlandChina,
          otherLocations,
          deltaConfirmed,
          totalRecovered,
          confirmed: {
            total: totalConfirmed,
            china: mainlandChina,
            outsideChina: otherLocations
          },
          deltaConfirmedDetail: {
            total: deltaConfirmed,
            china:
              (cur.countryRegion === "China" ? cur.deltaConfirmed : 0) +
              ((acc[cur.date] &&
                acc[cur.date].deltaConfirmed &&
                acc[cur.date].deltaConfirmed.china) ||
                0),
            outsideChina:
              (cur.countryRegion !== "China" ? cur.deltaConfirmed : 0) +
              ((acc[cur.date] &&
                acc[cur.date].deltaConfirmed &&
                acc[cur.date].deltaConfirmed.outsideChina) ||
                0)
          },
          deaths: {
            total:
              cur.deaths +
              ((acc[cur.date] &&
                acc[cur.date].deaths &&
                acc[cur.date].deaths.total) ||
                0),
            china:
              (cur.countryRegion === "China" ? cur.deaths : 0) +
              ((acc[cur.date] &&
                acc[cur.date].deaths &&
                acc[cur.date].deaths.china) ||
                0),
            outsideChina:
              (cur.countryRegion !== "China" ? cur.deaths : 0) +
              ((acc[cur.date] &&
                acc[cur.date].deaths &&
                acc[cur.date].deaths.outsideChina) ||
                0)
          },
          recovered: {
            total: totalRecovered,
            china:
              (cur.countryRegion === "China" ? cur.recovered : 0) +
              ((acc[cur.date] &&
                acc[cur.date].recovered &&
                acc[cur.date].recovered.china) ||
                0),
            outsideChina:
              (cur.countryRegion !== "China" ? cur.recovered : 0) +
              ((acc[cur.date] &&
                acc[cur.date].recovered &&
                acc[cur.date].recovered.outsideChina) ||
                0)
          },
          active: cur.active + ((acc[cur.date] && acc[cur.date].active) || 0),
          deltaRecovered:
            cur.deltaRecovered +
            ((acc[cur.date] && acc[cur.date].deltaRecovered) || 0),
          incidentRate:
            cur.incidentRate +
            ((acc[cur.date] && acc[cur.date].incidentRate) || 0),
          peopleTested:
            cur.peopleTested +
            ((acc[cur.date] && acc[cur.date].peopleTested) || 0)
        }
      };
    }, {})
  );
  response.json(
    result.map(([reportDate, data]: [string, any]) => ({
      ...data,
      reportDate
    }))
  );
};
