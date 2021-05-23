import { Heading, HeadingProps } from "@chakra-ui/react";

interface ViewTitleProps extends HeadingProps {}

export function ViewTitle({ children, ...rest }: ViewTitleProps) {
  return (
    <Heading as="h1" fontSize="4xl" fontWeight="bold" mb={8} {...rest}>
      {children}
    </Heading>
  );
}
