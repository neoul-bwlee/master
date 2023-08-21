package com.neoulsoft.tcare.db.type;

public enum UserType {
    SA(0, "superadmin"),
    ADMIN(1, "admin"),
    SERVICE_ADMIN(3, "serviceadmin"),
    USER(8, "user"),
    GUEST(9, "guest");

    private int type;
    private String typeName;

    UserType(int type, String typeName) {
        this.type = type;
        this.typeName = typeName;
    }

    public int getType() {
        return type;
    }

    @Override
    public String toString() {
        return typeName;
    }

    public static UserType parse(String type) {
        if (type.equals(SA.toString()))
            return SA;
        if (type.equals(ADMIN.toString()))
            return ADMIN;
        if (type.equals(SERVICE_ADMIN.toString()))
            return SERVICE_ADMIN;
        if (type.equals(USER.toString()))
            return USER;
        return GUEST;
    }

    public static UserType parse(Integer type) {
        if (type == SA.getType())
            return SA;
        if (type == ADMIN.getType())
            return ADMIN;
        if (type == SERVICE_ADMIN.getType())
            return SERVICE_ADMIN;
        if (type == USER.getType())
            return USER;
        return GUEST;
    }

    public enum NAuth {
        SA(0, "superadmin"),
        ADMIN(1, "admin"),

        USER_LEVEL_2(2, "userlevel2"),
        USER_LEVEL_3(3, "userlevel3"),
        USER_LEVEL_4(4, "userlevel4"),
        USER_LEVEL_5(5, "userlevel5"),
        USER_LEVEL_6(6, "userlevel6"),
        USER_LEVEL_7(7, "userlevel7"),

        USER(8, "user"),
        GUEST(9, "guest");

        private int type;
        private String typeName;

        NAuth(int type, String typeName) {
            this.type = type;
            this.typeName = typeName;
        }

        public int getType() {
            return type;
        }

        @Override
        public String toString() {
            return typeName;
        }

        public static NAuth parse(String type) {
            if (type.equals(SA.toString()))
                return SA;
            if (type.equals(ADMIN.toString()))
                return ADMIN;
            if (type.equals(USER_LEVEL_2.toString()))
                return USER_LEVEL_2;
            if (type.equals(USER_LEVEL_3.toString()))
                return USER_LEVEL_3;
            if (type.equals(USER_LEVEL_4.toString()))
                return USER_LEVEL_4;
            if (type.equals(USER_LEVEL_5.toString()))
                return USER_LEVEL_5;
            if (type.equals(USER_LEVEL_6.toString()))
                return USER_LEVEL_6;
            if (type.equals(USER_LEVEL_7.toString()))
                return USER_LEVEL_7;
            if (type.equals(USER.toString()))
                return USER;
            return GUEST;
        }

        public static NAuth parse(Integer type) {
            if (type == SA.getType())
                return SA;
            if (type == ADMIN.getType())
                return ADMIN;
            if (type == USER_LEVEL_2.getType())
                return USER_LEVEL_2;
            if (type == USER_LEVEL_3.getType())
                return USER_LEVEL_3;
            if (type == USER_LEVEL_4.getType())
                return USER_LEVEL_4;
            if (type == USER_LEVEL_5.getType())
                return USER_LEVEL_5;
            if (type == USER_LEVEL_6.getType())
                return USER_LEVEL_6;
            if (type == USER_LEVEL_7.getType())
                return USER_LEVEL_7;
            if (type == USER.getType())
                return USER;
            return GUEST;
        }
    }
}
