import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList, Text
} from "@chakra-ui/react";
import { User } from "next-auth";
import { signOut } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineLogout } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import SendyLogo from "../assets/sendy.svg";



type PropTypes = {
  user: User;
};

// maxW={[200, 400, 600, 800, 1120]}
const TopMenu = ({ user }: PropTypes) => (
  <Flex py={2} margin="0 auto" w={["100%", "100%", "100%", "960px","960px"]} alignItems="center" justifyContent="space-between" direction="row">
    <Flex direction="row">
      <Link href="/" passHref>
          <Heading
            cursor="pointer"
            size="md"
            position="relative"
            top="8px"
            color="black"
          >
            sendy
          </Heading>
      </Link>
      <Link href="/" passHref>
        <a>
          <Image  src={SendyLogo} width="66px" height="43px" alt="Sendy logo" />
        </a>
      </Link>
    </Flex>
    <Flex
      p={2}
      pl={3}
      pr={3}
      background="white"
      alignItems="center"
    >
      <Avatar size="sm" name={user.name!} src={user.image || undefined} />
      <Box mx="2">
        <Text fontSize="sm" fontWeight="bold">{user.name}</Text>
        <Text fontSize="xs">{user.email}</Text>
      </Box>
      <Menu placement="bottom-end">
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<IoIosArrowDown />}
          variant="outline"
          verticalAlign="-10px"
          size="sm"
          isRound
        />
        <MenuList>
          <MenuItem icon={<HiOutlineLogout />} onClick={() => signOut()}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  </Flex>
);

export default TopMenu;
