import Topbar from "../components/Topbar";
import Container from "@mui/material/Container";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  InputBase,
  InputLabel,
  Link,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { textAlign } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useForm } from "react-hook-form";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  deleteProductsFromDB,
  fetchServer,
  sendFilesToServer,
} from "../utils/serverUtils";
import {
  CHANGE_PRODUCT_URL,
  DELETE_PRODUCTS_URL,
  GET_MY_PRODUCTS_URL,
  SET_PRODUCT_URL,
} from "../utils/urls";

export interface IProducts {
  name: string;
  category: string;
  subCategory: string;
  price: number;
  description: string;
  amount: number;
}

type TFilterOpt = "name" | "price" | "description" | "category" | "subCategory";

function createData(
  name: string,
  category: string,
  subCategory: string,
  price: number,
  description: string,
  amount: number
): IProducts {
  return {
    name,
    category,
    subCategory,
    price,
    description,
    amount,
  };
}

export function Products() {
  const mediaGreaterThan700px = useMediaQuery("(min-width: 700px)");
  const mediaGreaterThan500px = useMediaQuery("(min-width: 500px)");
  const theme = useTheme();
  const authContext = useContext(AuthContext);
  const darkMode = useContext(ThemeContext);
  const [products, setProducts] = useState<IProducts[]>([]);
  const [recoveryArray, setRecoveryArray] = useState<IProducts[]>([]);
  const [exactlySearch, setExactlySearch] = useState(false);

  const [textFilter, setTextFilter] = useState("");
  const [filterOpt, setFilterOpt] = useState<TFilterOpt>("category");
  const [isFilterOn, setIsFilterOn] = useState(false);
  function handleChangeFilter(e: SelectChangeEvent) {
    setFilterOpt(e.target.value as TFilterOpt);
  }
  function filterProductsByColumn(
    column_name: TFilterOpt,
    filterValue: string | number,
    exactly: boolean = false
  ): IProducts[] {
    const newArray = products.filter((product) => {
      const searchValue =
        column_name === "price" ? Number(filterValue) : filterValue;
      if (typeof searchValue === "number") {
        return product[column_name] === searchValue;
      } else if (exactly) {
        return (
          (product[column_name] as string).toUpperCase() ===
          (filterValue as string).toUpperCase()
        );
      } else {
        return (product[column_name] as string)
          .toUpperCase()
          .includes(searchValue.toUpperCase());
      }
    });
    return newArray;
  }

  useEffect(() => {
    const token = localStorage.getItem("auth-token") || "";
    const loadProducts = async (token: string) => {
      if (!token) return;
      const response = await fetchServer(GET_MY_PRODUCTS_URL, { token: token });
      const response_data = await response.json();
      if (response.status !== 200) {
        throw new Error(response_data.message);
      }
      const data: IProducts[] = response_data.map((elem: IProducts) =>
        createData(
          elem.name,
          elem.category,
          elem.subCategory,
          elem.price,
          elem.description,
          elem.amount
        )
      );
      if (data.length) {
        setProducts(data);
        setRecoveryArray(data);
      }
    };
    loadProducts(token).catch((e) => {
      console.log(e);
    });
  }, []);
  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const [openEditModal, setOpenEditModal] = useState(false);
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  const handleOpenEditModal = (product: IProducts) => {
    const { name, category, subCategory, price, description, amount } = product;
    setValue("edit-name", name);
    setValue("edit-category", category);
    setValue("edit-subCategory", subCategory);
    setValue("edit-price", price);
    setValue("edit-description", description);
    setValue("edit-amount", amount);
    setOpenEditModal(true);
  };
  const styleModal = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: mediaGreaterThan700px ? 600 : 350,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    pt: 2,
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const {
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    register: registerEdit,
    formState: { errors: errosEdit },
    setValue,
    getValues,
  } = useForm();

  const handleAddProductSubmit = async (data: any) => {
    const totalFiles = Object.keys(data.files).length;
    if (totalFiles > 5) {
      alert(
        `Não é permitido mais do que 5 fotos. Foram inseridas ${totalFiles}.`
      );
      return;
    }
    const localToken = localStorage.getItem("auth-token");
    const price = Number((data.price as string).replace(",", "."));
    // console.log(data.files)

    try {
      const response = await fetchServer(
        SET_PRODUCT_URL,
        { token: localToken, method: "POST" },
        { ...data, price: price }
      );
      const { message }: { message: string } = await response.json();
      if (response.status === 201) {
        alert(message);
        setProducts((oldState) => [
          ...oldState,
          {
            name: data.name,
            category: data.category,
            subCategory: data.subCategory,
            price: price,
            description: data.description,
            amount: data.amount,
          },
        ]);
        handleCloseModal();
        const upload_response = await sendFilesToServer(
          data.files,
          data.name,
          localToken
        );
        if (upload_response.status !== 201) {
          try {
            const { message } = await upload_response.json();
            alert(message);
          } catch (err) {
            alert(err);
          }
        }
      } else {
        alert(message);
      }
    } catch (err) {
      // setServerError(false);
      console.log(err);
    }
  };

  const handleEditProductSubmit = async (data: any) => {
    const token = localStorage.getItem("auth-token");
    try {
      const response = await fetchServer(
        CHANGE_PRODUCT_URL,
        { token, method: "PUT" },
        data
      );
      const res_data = await response.json();

      if (response.status !== 200) throw new Error(res_data.message);
      alert(res_data.message);

      setProducts((oldState) => {
        return [
          ...oldState.map((elem) =>
            elem.name === data["edit-name"]
              ? ({
                  ...elem,
                  category: data["edit-category"],
                  subCategory: data["edit-subCategory"],
                  price: data["edit-price"],
                  description: data["edit-description"],
                  amount: data["edit-amount"],
                } as IProducts)
              : elem
          ),
        ];
      });
      handleCloseEditModal();

      if (data["edit-files"].length) {
        console.log(data["edit-files"])
        const upload_response = await sendFilesToServer(
          data["edit-files"],
          data["edit-name"],
          token
        );
        if (upload_response.status !== 201) {
          try {
            const { message } = await upload_response.json();
            alert(message);
          } catch (err) {
            alert(err);
          }
        }
      }
    } catch (err) {
      alert(err);
    }

    // console.log(data);
  };

  function Row(props: {
    row: IProducts;
    products: IProducts[];
    setProducts: React.Dispatch<React.SetStateAction<IProducts[]>>;
    setRecoveryArray: React.Dispatch<React.SetStateAction<IProducts[]>>;
  }) {
    const { row, products, setProducts, setRecoveryArray } = props;
    const [isOpen, setIsOpen] = React.useState(false);

    async function deleteProduct(name: string) {
      const token = localStorage.getItem("auth-token") || "";
      try {
        const response = await deleteProductsFromDB([name], token);
        const data = await response.json();
        if (response.status !== 200) throw new Error(data.message);
        const newArray = products.filter((product) => product.name !== name);
        setProducts(newArray);
        setRecoveryArray(newArray);
      } catch (err) {
        alert(err);
      }
    }

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expandir linha"
              size="small"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="right">{row.category}</TableCell>
          <TableCell align="right">{row.subCategory}</TableCell>
          <TableCell align="right">{row.price}</TableCell>
          <TableCell align="right">{row.amount}</TableCell>
          <TableCell align="right">
            <IconButton
              onClick={() => {
                handleOpenEditModal(row);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                deleteProduct(row.name);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {row.name}
                </Typography>
                <Box>
                  <Typography variant="body1" component="div">
                    {row.description}
                  </Typography>
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <>
      <Topbar />
      <Container sx={{ pt: 6, minHeight: "calc(100vh - 64px)" }}>
        <Box mb={6} sx={{ width: "100%" }}>
          <Paper sx={{ mb: 3, p: 1 }}>
            <Stack
              gap={mediaGreaterThan700px ? 0 : 2}
              display="flex"
              flexDirection={mediaGreaterThan700px ? "row" : "column"}
              alignItems="center"
            >
              <Tooltip title="Adicionar produto">
                <IconButton
                  sx={!mediaGreaterThan700px ? { width: "100%" } : {}}
                  onClick={handleOpenModal}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <FormControl
                sx={!mediaGreaterThan700px ? { width: "100%" } : { flex: 1 }}
              >
                <InputBase
                  sx={{
                    p: 1,
                    pl: 2,
                    ml: 1,
                    flex: 1,
                    "&:focus-within": {
                      border: `1px solid ${theme.palette.primary.main}`,
                      borderRadius: 1,
                    },
                  }}
                  placeholder="Buscar"
                  inputProps={{ "aria-label": "Buscar produtos" }}
                  value={textFilter}
                  onChange={(e) => {
                    setTextFilter(e.target.value);
                    setProducts(recoveryArray);
                  }}
                  onKeyDown={(e) => {
                    if (e.key.toUpperCase() === "ENTER") {
                      setProducts(
                        filterProductsByColumn(
                          filterOpt,
                          textFilter,
                          exactlySearch
                        )
                      );
                      // setIsFilterOn
                    }
                  }}
                />
              </FormControl>
              <Box
                sx={!mediaGreaterThan700px ? { width: "100%" } : {}}
                pr={1}
                pl={2}
              >
                {isFilterOn ? (
                  <IconButton
                    sx={{ width: "100%" }}
                    onClick={() => {
                      setProducts(recoveryArray);
                      setIsFilterOn(false);
                    }}
                  >
                    <FilterAltOffIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    sx={{ width: "100%" }}
                    onClick={() => {
                      setProducts(
                        filterProductsByColumn(
                          filterOpt,
                          textFilter,
                          exactlySearch
                        )
                      );
                      setIsFilterOn(true);
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                )}
              </Box>
              <FormControl sx={!mediaGreaterThan700px ? { width: "100%" } : {}}>
                <Select
                  sx={
                    !mediaGreaterThan700px ? { width: "100%" } : { width: 160 }
                  }
                  labelId="filter-select"
                  id="select"
                  fullWidth
                  value={filterOpt}
                  onChange={handleChangeFilter}
                >
                  <MenuItem value="name">Produto</MenuItem>
                  <MenuItem value="category">Categoria</MenuItem>
                  <MenuItem value="subcategory">Subcategoria</MenuItem>
                  <MenuItem value="price">Preço</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                sx={
                  !mediaGreaterThan700px
                    ? {
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }
                    : { ml: 2, userSelect: "none" }
                }
                control={
                  <Checkbox
                    checked={exactlySearch}
                    onChange={() => {
                      setExactlySearch(!exactlySearch);
                    }}
                  />
                }
                label="Busca exata"
              />
            </Stack>
          </Paper>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Produto</TableCell>
                  <TableCell align="right">Categoria</TableCell>
                  <TableCell align="right">Subcategoria</TableCell>
                  <TableCell align="right">Preço&nbsp;(R$)</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <Row
                    products={products}
                    setProducts={setProducts}
                    key={product.name}
                    row={product}
                    setRecoveryArray={setRecoveryArray}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Paper sx={styleModal}>
            <Box
              mt={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              width={"100%"}
              component={"form"}
              onSubmit={handleSubmit(handleAddProductSubmit)}
            >
              <Box
                sx={{ position: "absolute", left: "calc(100% - 60px)" }}
                height={"8px"}
                justifyContent="flex-end"
              >
                <IconButton onClick={handleCloseModal}>
                  <CloseIcon sx={{ height: 18 }} />
                </IconButton>
              </Box>
              <Typography
                mb={3}
                id="modal-modal-title"
                variant="h6"
                component="h2"
              >
                Cadastrar novo produto
              </Typography>
              <Stack
                width="100%"
                spacing={1}
                display="flex"
                alignItems="center"
              >
                <TextField
                  {...register("name", {
                    required: true,
                    onChange: () => {},
                  })}
                  variant="outlined"
                  fullWidth
                  label="Nome do produto"
                  autoFocus
                ></TextField>
                <Stack
                  sx={{ width: "100%" }}
                  gap={1}
                  direction={mediaGreaterThan700px ? "row" : "column"}
                >
                  <TextField
                    {...register("price", {
                      required: true,
                      onChange: () => {},
                      pattern: /^[0-9\.\,]*$/g,
                    })}
                    fullWidth
                    variant="outlined"
                    label="Preço"
                    // sx={{ width: "80%" }}
                  />
                  <TextField
                    {...register("amount", {
                      required: true,
                      onChange: () => {},
                      pattern: /^[0-9]*$/g,
                    })}
                    fullWidth
                    variant="outlined"
                    label="Quantidade em estoque"
                    // sx={{ width: "80%" }}
                  />
                </Stack>
                <Stack
                  width={"100%"}
                  gap={1}
                  direction={mediaGreaterThan700px ? "row" : "column"}
                >
                  <TextField
                    {...register("category", {
                      required: true,
                      onChange: () => {},
                    })}
                    fullWidth
                    variant="outlined"
                    label="Categoria"
                    // sx={{ width: "80%" }}
                  ></TextField>
                  <TextField
                    {...register("subCategory", {
                      required: true,
                      onChange: () => {},
                    })}
                    fullWidth
                    variant="outlined"
                    label="Sub-categoria"
                    // sx={{ width: "80%" }}
                  ></TextField>
                </Stack>
                <TextField
                  {...register("description", {
                    maxLength: 1000,
                  })}
                  multiline
                  maxRows={20}
                  fullWidth
                  label={"Descrição"}
                ></TextField>
                <Stack
                  gap={1}
                  direction={mediaGreaterThan700px ? "row" : "column"}
                  sx={{ width: "100%" }}
                >
                  <Button
                    endIcon={<PhotoCamera />}
                    component="label"
                    sx={{ mt: "2rem" }}
                    fullWidth
                    variant="outlined"
                  >
                    Adicionar fotos
                    <input
                      {...register("files")}
                      multiple={true}
                      hidden
                      accept="image/*"
                      type="file"
                    />
                  </Button>
                  <Button
                    sx={{ mt: "2rem" }}
                    fullWidth
                    type="submit"
                    variant="contained"
                  >
                    Cadastrar produto
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Modal>
        <Modal
          open={openEditModal}
          onClose={handleCloseEditModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Paper sx={styleModal}>
            <Box
              mt={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              width={"100%"}
              component={"form"}
              onSubmit={handleEditSubmit(handleEditProductSubmit)}
            >
              <Box
                sx={{ position: "absolute", left: "calc(100% - 60px)" }}
                height={"8px"}
                justifyContent="flex-end"
              >
                <IconButton onClick={handleCloseEditModal}>
                  <CloseIcon sx={{ height: 18 }} />
                </IconButton>
              </Box>
              <Typography
                mb={3}
                id="modal-modal-title"
                variant="h6"
                component="h2"
              >
                Editar produto
              </Typography>
              <Stack
                width="100%"
                spacing={1}
                display="flex"
                alignItems="center"
              >
                <TextField
                  {...registerEdit("edit-name", {
                    required: true,
                  })}
                  variant="outlined"
                  fullWidth
                  label="Nome do produto"
                  disabled
                ></TextField>
                <Stack
                  sx={{ width: "100%" }}
                  gap={1}
                  direction={mediaGreaterThan700px ? "row" : "column"}
                >
                  <TextField
                    {...registerEdit("edit-price", {
                      required: true,
                      onChange: () => {},
                      pattern: /^[0-9\.\,]*$/g,
                    })}
                    autoFocus
                    fullWidth
                    variant="outlined"
                    label="Preço"
                    // sx={{ width: "80%" }}
                  />
                  <TextField
                    {...registerEdit("edit-amount", {
                      required: true,
                      pattern: /^[0-9]*$/g,
                    })}
                    autoFocus
                    fullWidth
                    variant="outlined"
                    label="Quantidade em estoque"
                    // sx={{ width: "80%" }}
                  />
                </Stack>
                <Stack
                  width={"100%"}
                  gap={1}
                  direction={mediaGreaterThan700px ? "row" : "column"}
                >
                  <TextField
                    {...registerEdit("edit-category", {
                      required: true,
                      onChange: () => {},
                    })}
                    fullWidth
                    variant="outlined"
                    label="Categoria"
                    // sx={{ width: "80%" }}
                  ></TextField>
                  <TextField
                    {...registerEdit("edit-subCategory", {
                      required: true,
                      onChange: () => {},
                    })}
                    fullWidth
                    variant="outlined"
                    label="Sub-categoria"
                    // sx={{ width: "80%" }}
                  ></TextField>
                </Stack>
                <TextField
                  {...registerEdit("edit-description", {
                    maxLength: 1000,
                  })}
                  multiline
                  maxRows={20}
                  fullWidth
                  label={"Descrição"}
                ></TextField>
                <Stack
                  gap={1}
                  direction={mediaGreaterThan700px ? "row" : "column"}
                  width={"100%"}
                  display="flex"
                  alignItems="center"
                >
                  <Tooltip title="As novas fotos subtituirão todas as fotos anteriores">
                    <Button
                      endIcon={<PhotoCamera />}
                      component="label"
                      sx={{ mt: "2rem" }}
                      fullWidth
                      variant="outlined"
                    >
                      Trocar fotos
                      <input
                        {...registerEdit("edit-files")}
                        multiple={true}
                        hidden
                        accept="image/*"
                        type="file"
                      />
                    </Button>
                  </Tooltip>
                  <Button
                    sx={{ mt: "2rem" }}
                    fullWidth
                    type="submit"
                    variant="contained"
                  >
                    Salvar alterações
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Modal>
      </Container>
    </>
  );
}

export default Products;
