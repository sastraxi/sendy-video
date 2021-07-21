import { As, Heading, Text, Icon } from '@chakra-ui/react';
import { FaBeer } from 'react-icons/fa';

type PropTypes = {
  heading: string,
  message: string,
  icon?: As<any>,
};

const SplashModal = ({ heading, message, icon }: PropTypes) => {
  return (
    <div>
      <Heading>{heading}</Heading>
      <Text>{message}</Text>
      {icon && <Icon as={icon} />}
    </div>
  )
};

export default SplashModal;
