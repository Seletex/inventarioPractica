import { useForm } from "react-hook-form";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Link } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Datos enviados:", data);
    // Aquí iría tu lógica de autenticación
  };

  return (
    <div
      style={{
        minHeight: "100vh", // Altura mínima para ocupar toda la pantalla
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      <Card
        title="Login"
        className="w-full md:w-30rem"
        style={{
          width: "400px", // Ajusta el ancho de la tarjeta según necesites
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          fontFamily: "'Times New Roman', Times, serif",
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-fluid"
          style={{ width: "100%", borderRadius: "5px" }}
        >
          <div className="field mb-4">
            <span className="p-input-icon-left w-full">
              <i className="pi pi-user" />
              <InputText
                id="username"
                {...register("username", {
                  required: "El nombre de Usuario es requerido",
                })}
                placeholder="Carlos123"
                className={classNames("w-full", {
                  "p-invalid": errors.username,
                })}
              />
            </span>
            {errors.username && (
              <small className="p-error block mt-1">
                {errors.username.message}
              </small>
            )}
          </div>

          <div className="field mb-4">
            <span className="p-input-icon-left w-full">
              <i className="pi pi-lock" />
              <InputText
                id="password"
                type="password"
                {...register("password", {
                  required: "La Contraseña es requerida",
                })}
                placeholder="Ab12345+"
                className={classNames("w-full", {
                  "p-invalid": errors.password,
                })}
              />
            </span>
            {errors.password && (
              <small className="p-error block mt-1">
                {errors.password.message}
              </small>
            )}
          </div>

          <Button
            label="INGRESAR"
            icon="pi pi-sign-in"
            className="w-full"
            type="submit"
            disabled={!isValid}
          />
          <div className="text-center mt-4 pt-3 border-top-1 surface-border">
            <Link
              to="/register"
              className="p-button p-button-secondary p-button-sm w-full md:w-auto"
            >
              {" "}
              ¿Se te ha olvidado la contraseña? ¡Recuperala!
            </Link>
          </div>

          <div className="text-center mt-4 pt-3 border-top-1 ">
            <p className="text-sm mb-2">
              ¿Necesitas ayuda o quieres consultar un equipo?
            </p>
            <div className="flex flex-column align-items-center gap-2">
              <Link
                to="/solicitar-mantenimiento"
                className="p-button p-button-secondary p-button-sm w-full md:w-auto"
              >
                <i className="pi pi-wrench mr-2"></i>
                Solicitar Mantenimiento
              </Link>
              <Link
                to="/consultar-equipo"
                className="p-button p-button-info p-button-sm w-full md:w-auto"
              >
                <i className="pi pi-search mr-2"></i>
                Consultar Equipo por Placa
              </Link>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
//Luz Mery Rios Alzate:  3127469768
