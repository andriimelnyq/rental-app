import { CardContent, CardMedia, Typography, Card } from "@mui/material";
import { TRentalItem } from "../../types";
import { FC } from "react";
import "./CardItem.scss";

type TProps = {
  rentItem: TRentalItem;
};

const CardItem: FC<TProps> = ({ rentItem }) => {
  const { imgUrl, address, description } = rentItem;

  return (
    <div className="card-item">
      <Card>
        <CardMedia
          component="img"
          height="240"
          image={imgUrl}
          alt="green iguana"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {address}
          </Typography>

          <Typography gutterBottom variant="h6" component="div">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
};

export default CardItem;