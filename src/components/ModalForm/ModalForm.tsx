import { Backdrop, Box, Button, Fade, Modal, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FC, useState } from "react";
import { useAppDispatch } from "../../utils/hooks.tsx";
import { addNew } from "../../store/rentItems.tsx";
import "./ModalForm.scss";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #283149',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

type TProps = {
  open: boolean,
  handleClose: () => void;
}

const ModalForm: FC<TProps> = ({ handleClose, open }) => {
  const dispatch = useAppDispatch();
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const clearForm = () => {
    setAddress("");
    setUploadedImage(null);
    setDescription("");
  };
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(addNew({address, uploadedImage, description }));
    clearForm();
    handleClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedImage(e.target.files[0]);
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <Modal
      className="modal-form"
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Додайте оголошення
          </Typography>

          <form onSubmit={e => handleSubmitForm(e)}>
            <Typography sx={{ mt: 2 }}>
              Ввведіть адресу
            </Typography>

            <Typography variant="caption" display="block" gutterBottom>
              (Наприклад: "Львів, вулиця Шевченка, 22")
            </Typography>

            <TextField
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              label="Адреса"
              variant="outlined"
              sx={{ width: "100%", mt: 1 }}
              required
            />

            <Typography sx={{ mt: 2 }}>
              Додайте опис
            </Typography>

            <Typography variant="caption" display="block" gutterBottom>
              (Деталі, вартість, контакти...)
            </Typography>

            <TextField
              id="outlined-multiline-static"
              label="Опис"
              multiline
              rows={4}
              value={description}
              sx={{ width: "100%", mt: 1 }}
              onChange={e => setDescription(e.target.value)}
              required
            />

            <Typography sx={{ mt: 2 }}>
              Прикріпіть фото
            </Typography>

            <div className="modal-form__file">
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon/>
              }>
                Завантажити файл
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileChange}
                  required={uploadedImage === null}
                />
              </Button>

              {uploadedImage && (
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Uploaded Preview"
                  className="modal-form__file-img"
                />
              )}
            </div>

            <div className="modal-form__control">
              <Button
                type="submit"
                variant="contained"
              >
                Опублікувати
              </Button>

              <Button
                variant="outlined"
                onClick={clearForm}
              >
                Очистити
              </Button>
            </div>
          </form>
        </Box>
      </Fade>
    </Modal>
  )
};

export default ModalForm;