import Layout from '../../components/Layout/Layout'
import styles from './About.module.css'

export default function About() {
  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.title}>Acerca de</p>
        <div className={styles.card}>
          <p className={styles.appName}>Finance</p>
          <p className={styles.version}>Versión 1.0.0</p>
          <p className={styles.text}>
            Aplicación de gestión de presupuesto personal basada en el método de sobres.
            Administra tus cuentas, categorías y transacciones de forma sencilla.
          </p>
          <div className={styles.divider} />
          <p className={styles.stack}>Desarrollado con Spring Boot 3 + React</p>
        </div>
      </div>
    </Layout>
  )
}