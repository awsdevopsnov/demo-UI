import React, { useState, useEffect } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import ToastUi from "../../components/ui/ToastifyUi";
import Container from "@mui/material/Container";
import CompanyDetailsScreen from "../company/Company-details-screen";
import About from "../about/About";
import TaxConfig from "./TaxConfig";
import LinkScreen from "../links/Portal-link-screen";

const SettingScreen = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [initialValuesLoaded, setInitialValuesLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Load initial values when the component mounts
    loadInitialValues();
  }, []);

  const loadInitialValues = () => {
    // Your logic to load initial values goes here
    // Example:
    // fetchData().then((data) => {
    //   // Set initial values based on the fetched data
    //   setInitialValuesLoaded(true);
    // });
    setInitialValuesLoaded(true); // For demonstration, setting it to true immediately
  };

  const handleTabChange = (e: React.ChangeEvent<{}>, tabIndex: number) => {
    setCurrentTabIndex(tabIndex);
  };

  const renderTabContent = () => {
    switch (currentTabIndex) {
      case 0:
        return <CompanyDetailsScreen />;
      case 1:
        return <LinkScreen />;
      case 2:
        return <TaxConfig />;
      case 3:
        return <About />;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <ToastUi autoClose={1000} />
      <Tabs value={currentTabIndex} variant="fullWidth" onChange={handleTabChange}>
        <Tab label="Company Settings" />
        <Tab label="Portals" />
        <Tab label="Tax" />
        <Tab label="About" />
      </Tabs>

      <Container fixed>
        <Box>
          {initialValuesLoaded ? (
            renderTabContent()
          ) : (
            <Typography>Loading initial values...</Typography>
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default SettingScreen;
