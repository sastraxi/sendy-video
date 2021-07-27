import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { User } from "next-auth";
import Image from "next/image";
import { HiOutlineLogout } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import SendyLogo from "../assets/sendy.svg";

import { signOut } from "next-auth/client"

type PropTypes = {
  user?: User;
  content: any;
};

// maxW={[200, 400, 600, 800, 1120]}
const SplashContent = ({ user, content }: PropTypes) => (
  <>
    <Flex w="100%" alignItems="center" direction="column">
      <Box pl={10} mb={0} filter="drop-shadow(4px 8px 0px rgba(0, 0, 0, .15))">
        <Image src={SendyLogo} width="200px" height="130px" alt="Sendy logo" />
      </Box>
      <Heading
        size="2xl"
        position="relative"
        top="-20px"
        mb={8}
        color="black"
      >
        sendy
      </Heading>
      {content}
    </Flex>
    { user &&
      <Flex
        p={2}
        pl={3}
        pr={3}
        w="80%"
        minWidth="200px"
        borderRadius="48px"
        background="white"
        alignItems="center"
        boxShadow="0px 12px 28px rgba(0, 0, 0, 0.09)"
      >
        <Avatar name={user.name!} src={user.image || undefined} />
        <Box ml="3" flex={1}>
          <Text fontWeight="bold">{user.name}</Text>
          <Text fontSize="sm">{user.email}</Text>
        </Box>
        <Menu placement="bottom-end">
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<IoIosArrowDown />}
            variant="outline"
            isRound
            verticalAlign="-10px"
          />
          <MenuList>
            <MenuItem icon={<HiOutlineLogout />} onClick={() => signOut()}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    }
  </>
);

export default SplashContent;
