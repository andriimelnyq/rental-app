import { FC, useState } from "react";
import { TRentalItem } from "../../types";
import CardItem from "../CardItem/CardItem.tsx";
import "./CardsList.scss";
import ModalForm from "../ModalForm/ModalForm.tsx";
import { Button, Typography } from "@mui/material";

type TProps = {
  visibleCards: TRentalItem[];
};

const CardsList: FC<TProps> = ({ visibleCards }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleCloseModal = () => setIsOpenModal(false);
  const handleOpenModal = () => setIsOpenModal(true);
  const cardsCount = visibleCards.length;

  return (
    <section className="cards-list">
      <Button variant="contained" onClick={handleOpenModal}>
        Додати оголошення
      </Button>

      <Typography
        gutterBottom
        variant="h6"
        component="div"
      >
        {cardsCount > 0
          ? `Знайдено ${cardsCount} оголошення`
          : "Не знайдено оголошень"}
      </Typography>

      <ModalForm open={isOpenModal} handleClose={handleCloseModal} />

      {visibleCards.map(item => (
        <CardItem rentItem={item} key={item.id} />
      ))}
    </section>
  )
};

export default CardsList;