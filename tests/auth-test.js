import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "https://payboss-uat-backend.bgsgroup.co.zm/api/v2";

export const options = {
  // A number specifying the number of VUs to run concurrently.
  // vus: 10,
  // // A string specifying the total duration of the test run.
  // duration: "30s",

  stages: [
    { duration: "10s", target: 20 },
    { duration: "20s", target: 100 },
    { duration: "30s", target: 500 },
    { duration: "30s", target: 100 },
  ],

  // The following section contains configuration options for execution of this
  // test script in Grafana Cloud.
  //
  // See https://grafana.com/docs/grafana-cloud/k6/get-started/run-cloud-tests-from-the-cli/
  // to learn about authoring and running k6 test scripts in Grafana k6 Cloud.
  //
  // cloud: {
  //   // The ID of the project to which the test is assigned in the k6 Cloud UI.
  //   // By default tests are executed in default project.
  //   projectID: "",
  //   // The name of the test in the k6 Cloud UI.
  //   // Test runs with the same name will be grouped.
  //   name: "auth-test.js"
  // },

  // Uncomment this section to enable the use of Browser API in your tests.
  //
  // See https://grafana.com/docs/k6/latest/using-k6-browser/running-browser-tests/ to learn more
  // about using Browser API in your test scripts.
  //
  // scenarios: {
  //   // The scenario name appears in the result summary, tags, and so on.
  //   // You can give the scenario any name, as long as each name in the script is unique.
  //   ui: {
  //     // Executor is a mandatory parameter for browser-based tests.
  //     // Shared iterations in this case tells k6 to reuse VUs to execute iterations.
  //     //
  //     // See https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ for other executor types.
  //     executor: 'shared-iterations',
  //     options: {
  //       browser: {
  //         // This is a mandatory parameter that instructs k6 to launch and
  //         // connect to a chromium-based browser, and use it to run UI-based
  //         // tests.
  //         type: 'chromium',
  //       },
  //     },
  //   },
  // }
};

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  const loginData = {
    emailusername: "thompson-approver",
    password: "Tm123456!",
  };

  const apiCollectionAuthData = {
    username: "bc648f2b-2bc5-47f8-9e23-f9b6a80a4705",
    apikey:
      "JF1Yrbk07Vcaa4q0ZXB6biT19ikQ5zLr99m4pobkoM1QsaoMfx055rf5lYJBAiJpqwoGVw",
  };

  // const response = http.post(
  //   `${BASE_URL}/merchant/user/authentication`,
  //   JSON.stringify(data),
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

  const response = http.post(
    `${BASE_URL}/transaction/collection/auth`,
    JSON.stringify(apiCollectionAuthData),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  check(response, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
