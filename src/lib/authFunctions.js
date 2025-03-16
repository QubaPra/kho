export const validate = (privEmail = null, mentorMail = null, name = null, date = null, team = null, rank = null) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-ZÀ-Ž][a-zà-ž]+(?:[-\s][A-ZÀ-Ž][a-zà-ž]+)+$/;
    const today = new Date().toISOString().split("T")[0]; // dzisiejsza data w formacie YYYY-MM-DD

    if (!privEmail) {
        newErrors.privEmail = "Email do kontaktu jest wymagany";
    } else if (!emailRegex.test(privEmail)) {
        newErrors.privEmail = "Email do kontaktu jest nieprawidłowy";
    } else if (privEmail.length > 100) {
        newErrors.privEmail =
            "Email do kontaktu nie może być dłuższy niż 100 znaków";
    }

    if (mentorMail === privEmail) {
        newErrors.mentorMail = "Email opiekuna nie może być taki sam jak twój";
    } else if (mentorMail) {
        if (!emailRegex.test(mentorMail)) {
            newErrors.mentorMail = "Email opiekuna jest nieprawidłowy";
        } else if (mentorMail.length > 100) {
            newErrors.mentorMail =
                "Email opiekuna nie może być dłuższy niż 100 znaków";
        }
    }

    if (name) {
      if (!nameRegex.test(name)) {
        newErrors.name = "Imię i nazwisko są nieprawidłowe";
      } else if (name.length > 100) {
        newErrors.name = "Imię i nazwisko nie mogą być dłuższe niż 100 znaków";
      }
    }

    if (!date) {
      newErrors.date = "Data urodzenia jest wymagana";
    } else if (date >= today) {
      newErrors.date = "Data urodzenia musi być wcześniejsza niż dzisiejsza";
    }

    if (!team) {
      newErrors.team = "Drużyna jest wymagana";
    }

    if (!rank) {
      newErrors.rank = "Stopień jest wymagany";
    }

    return newErrors;
};

export const validateEmailName = (email = null, name = null) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-ZÀ-Ž][a-zà-ž]+(?:[-\s][A-ZÀ-Ž][a-zà-ž]+)+$/;

    if (!email) {
      newErrors.email = "Email jest wymagany";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email jest nieprawidłowy";
    } else if (email.length > 100) {
      newErrors.email = "Email nie może być dłuższy niż 100 znaków";
    }

    if (!name) {
      newErrors.name = "Imię i nazwisko są wymagane";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Imię i nazwisko są nieprawidłowe";
    } else if (name.length > 100) {
      newErrors.name = "Imię i nazwisko nie mogą być dłuższe niż 100 znaków";
    }

    return newErrors;
  };

export const validatePassword = (currentPassword = null, newPassword = null) => {
    const newErrors = {};
    if (!currentPassword) {
      newErrors.currentPassword = "Obecne hasło jest wymagane";
    }
    if (!newPassword) {
      newErrors.newPassword = "Nowe hasło jest wymagane";
    } else if (newPassword.length < 4) {
      newErrors.newPassword = "Hasło musi mieć minimum 4 znaki";
    } else if (/\s/.test(newPassword)) {
      newErrors.newPassword = "Hasło nie może zawierać spacji";
    } else if (newPassword.length > 100) {
      newErrors.newPassword = "Hasło nie może być dłuższe niż 100 znaków";
    }
    
    return newErrors;
};