import axios from "axios";
import Converter from "./Converter";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

jest.mock("axios", () => {
  return {
    get: jest.fn(),
  };
});

describe("Mocks API endpoint", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("Should return the proper data", async () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        AED: "United Arab Emirates Dirham",
        AFN: "Afghan Afghani",
        ALL: "Albanian Lek",
        AMD: "Armenian Dram",
      })
    );

    const { getByTestId, getAllByTestId } = render(<Converter />);
    const button = screen.getByText("Convert");

    await waitFor(() => {
      fireEvent.click(button);
    });

    await act(async () => {
      expect(axios.get).toHaveBeenCalledWith(
        "https://openexchangerates.org/api/currencies.json"
      );
    });
  });
});
