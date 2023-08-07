namespace Item11 {
  interface User {
    user_id: string;
    name: string;
    age: number;
  }

  interface GetUserDto {
    user_id: string;
    user_name?: string;
  }

  const user: User = {
    user_id: "user_id",
    name: "name",
    age: 20,

    /**
     * '{ user_id: string; name: string; age: number; school_name: string; }' 형식은 'User' 형식에 할당할 수 없습니다.
     * 개체 리터럴은 알려진 속성만 지정할 수 있으며 'User' 형식에 'school_name'이(가) 없습니다.
     */
    // school_name: "school_name",
  };
  const getUserDto: GetUserDto = user; // OK
  const getUserDto2: GetUserDto = {
    user_id: "user_id",
    user_name: "user_name",
    /**
     *  '{ user_id: string; user_name: string; age: number; }' 형식은 'GetUserDto' 형식에 할당할 수 없습니다.
     * 개체 리터럴은 알려진 속성만 지정할 수 있으며 'GetUserDto' 형식에 'age'이(가) 없습니다.
     *
     */
    // age: 20,
  };

  const getUser = (getUserDto: GetUserDto): User => {
    return {
      user_id: getUserDto.user_id,
      name: getUserDto.user_name || "",
      age: 0,
    };
  };

  const result1 = getUser(getUserDto); // OK
  const result2 = getUser(getUserDto2); // OK
  const result3 = getUser({
    user_id: "user_id",
    user_name: "user_name",
    // age: 20, // Error
  });
}
