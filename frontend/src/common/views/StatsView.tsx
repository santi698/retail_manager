import {
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { ViewTitle } from "../components/ViewTitle";

export function StatsView() {
  return (
    <>
      <ViewTitle>Vista General</ViewTitle>
      <SimpleGrid columns={2}>
        <Stat>
          <StatLabel>Vendido</StatLabel>
          <StatNumber>$0.00</StatNumber>
          <StatHelpText>12/08 - 28/08</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Cobrado</StatLabel>
          <StatNumber>$0.00</StatNumber>
          <StatHelpText>12/08 - 28/08</StatHelpText>
        </Stat>
      </SimpleGrid>
    </>
  );
}
