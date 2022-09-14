import {
  Box,
  Center,
  Text,
  Link as ChakraLink,
  Flex,
  Button,
  Input,
} from "@chakra-ui/react";

export const ResursiveFileList = ({
  trees,
  depth = 0,
  url,
}: {
  trees: any[];
  depth?: number;
  url: (path: string, children: boolean) => string;
}) => {
  return (
    <Box position="relative">
      {trees.map((el) => {
        if (el.children !== null) {
          return (
            <Box
              position="relative"
              key={el.name}
              marginLeft={`${8 * depth}px`}
              paddingY="1.5"
              _hover={{
                _before: {
                  background: "gray.500",
                },
              }}
              _before={{
                top: "5px",
                left: "-10px",
                content: '""',
                position: "absolute",
                width: "2px",
                height: "calc(100% - 10px)",
                background: "gray.300",
                borderRadius: "4px",
                zIndex: 1,
              }}
            >
              <Box position="relative">
                <Text>
                  <ChakraLink
                    target="_blank"
                    href={url(el.path, !!el.children)}
                  >
                    {el.name}
                  </ChakraLink>
                </Text>
                <ResursiveFileList
                  trees={el.children}
                  depth={depth + 1}
                  url={url}
                />
              </Box>
            </Box>
          );
        }

        return (
          <Box
            position="relative"
            paddingY="1"
            key={el.name}
            marginLeft={`${8 * depth}px`}
            _hover={{
              _before: {
                bg: "gray.500",
              },
            }}
            _before={
              depth > 0
                ? {
                    content: '""',
                    width: `${8 * depth + 5}px`,
                    height: "2px",
                    bg: "gray.300",
                    position: "absolute",
                    top: "50%",
                    left: `-${8 * depth + 10}px`,
                    borderRightRadius: "4px",
                  }
                : {}
            }
          >
            <Text>
              <ChakraLink target="_blank" href={url(el.path, !!el.children)}>
                {el.name}
              </ChakraLink>
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};
